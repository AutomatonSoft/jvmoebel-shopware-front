"use server";

import { ApiClientError } from "@shopware/api-client";
import type { Route } from "next";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clearMockCart } from "@/features/cart/server/mock-cart";
import type { CheckoutActionState } from "@/features/checkout/model/checkout";
import {
  getGuestCheckoutRegistrationFieldErrors,
  parseCheckoutAddress,
  parseCheckoutMethodSelection,
  parseGuestPassword,
  validateGuestCheckoutRegistration,
} from "@/features/checkout/model/validation";
import {
  convertMockCheckoutGuest,
  createMockCheckoutReceipt,
  mockCheckoutOptions,
  registerMockCheckoutGuest,
} from "@/features/checkout/server/mock-checkout";
import { persistCheckoutReceipt } from "@/features/checkout/server/receipt";
import { getShopCart } from "@/features/cart/server/cart";
import {
  createCustomerSession,
  persistCustomerContext,
} from "@/features/customer-account/server/session";
import {
  convertShopwareGuest,
  createShopwareCheckoutOrder,
  getShopwareCheckoutCustomer,
  getShopwareCheckoutOptions,
  registerShopwareGuest,
  updateShopwareCustomerAddress,
} from "@/integrations/shopware/checkout";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";

function optionsContainCountry(
  countryIds: readonly string[],
  availableIds: readonly string[],
) {
  return countryIds.every((id) => availableIds.includes(id));
}

function getActionError(error: unknown, fallback: string): CheckoutActionState {
  if (error instanceof ApiClientError && error.status === 400) {
    return {
      message:
        "Shopware konnte diese Angaben nicht übernehmen. Bitte prüfen Sie Ihre Daten.",
      status: "invalid",
    };
  }

  console.error(fallback, error);

  return {
    message:
      "Der Checkout ist gerade nicht verfügbar. Bitte versuchen Sie es erneut.",
    status: "error",
  };
}

async function getRequestOrigin() {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");

  if (origin) {
    return new URL(origin).origin;
  }

  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";

  if (!host || (protocol !== "http" && protocol !== "https")) {
    throw new Error("Could not determine the storefront origin.");
  }

  return `${protocol}://${host}`;
}

export async function registerCheckoutGuest(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const validation = validateGuestCheckoutRegistration(formData);

  if (!validation.success) {
    return {
      fieldErrors: getGuestCheckoutRegistrationFieldErrors(validation.error),
      message: "Bitte füllen Sie alle Pflichtfelder vollständig aus.",
      status: "invalid",
    };
  }

  const registration = validation.data;

  try {
    if (shouldUseShopwareMocks()) {
      const countryIds = [
        registration.billingAddress.countryId,
        ...(registration.shippingAddress
          ? [registration.shippingAddress.countryId]
          : []),
      ];

      if (
        !optionsContainCountry(
          countryIds,
          mockCheckoutOptions.countries.map((country) => country.id),
        )
      ) {
        return {
          message: "Bitte wählen Sie ein gültiges Land.",
          status: "invalid",
        };
      }

      await registerMockCheckoutGuest(registration);
    } else {
      const session = await createCustomerSession();
      const options = await getShopwareCheckoutOptions(session.client);
      const countryIds = [
        registration.billingAddress.countryId,
        ...(registration.shippingAddress
          ? [registration.shippingAddress.countryId]
          : []),
      ];

      if (
        !optionsContainCountry(
          countryIds,
          options.countries.map((country) => country.id),
        )
      ) {
        return {
          message: "Bitte wählen Sie ein gültiges Land.",
          status: "invalid",
        };
      }

      await registerShopwareGuest(session.client, registration);
      await persistCustomerContext(session.getContextToken());
    }
  } catch (error) {
    return getActionError(error, "Guest checkout registration failed.");
  }

  revalidatePath("/kasse");
  redirect("/kasse?schritt=zahlung");
}

export async function saveCustomerCheckoutAddress(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const address = parseCheckoutAddress(formData);

  if (!address) {
    return {
      message: "Bitte füllen Sie alle Pflichtfelder vollständig aus.",
      status: "invalid",
    };
  }

  try {
    const session = await createCustomerSession();
    const options = await getShopwareCheckoutOptions(session.client);

    if (
      !options.countries.some((country) => country.id === address.countryId)
    ) {
      return {
        message: "Bitte wählen Sie ein gültiges Land.",
        status: "invalid",
      };
    }

    await updateShopwareCustomerAddress(session.client, address);
    await persistCustomerContext(session.getContextToken());
  } catch (error) {
    return getActionError(error, "Customer checkout address update failed.");
  }

  revalidatePath("/kasse");
  redirect("/kasse?schritt=zahlung");
}

export async function placeCheckoutOrder(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const selection = parseCheckoutMethodSelection(formData);

  if (!selection) {
    return {
      message:
        "Bitte wählen Sie Versand und Zahlung und bestätigen Sie die Bedingungen.",
      status: "invalid",
    };
  }

  let destination = "/bestellung/danke";

  try {
    if (shouldUseShopwareMocks()) {
      const cart = await getShopCart();
      const receipt = createMockCheckoutReceipt(
        selection,
        cart.total,
        cart.currency,
      );

      await persistCheckoutReceipt(receipt);
      await clearMockCart();
    } else {
      const session = await createCustomerSession();
      const [customer, options] = await Promise.all([
        getShopwareCheckoutCustomer(session.client),
        getShopwareCheckoutOptions(session.client),
      ]);

      if (!customer?.addressComplete) {
        return {
          message: "Bitte ergänzen Sie zuerst Ihre Lieferadresse.",
          status: "invalid",
        };
      }

      const paymentMethodValid = options.paymentMethods.some(
        (method) => method.id === selection.paymentMethodId,
      );
      const shippingMethodValid = options.shippingMethods.some(
        (method) => method.id === selection.shippingMethodId,
      );

      if (!paymentMethodValid || !shippingMethodValid) {
        return {
          message:
            "Die gewählte Versand- oder Zahlungsart ist nicht mehr verfügbar.",
          status: "invalid",
        };
      }

      const origin = await getRequestOrigin();
      const result = await createShopwareCheckoutOrder(
        session.client,
        selection,
        {
          errorUrl: `${origin}/kasse?fehler=zahlung`,
          finishUrl: `${origin}/bestellung/danke`,
        },
      );

      await persistCustomerContext(session.getContextToken());
      await persistCheckoutReceipt(result.receipt);
      destination = result.redirectUrl
        ? result.redirectUrl
        : result.paymentPending
          ? "/bestellung/danke?zahlung=offen"
          : destination;
    }
  } catch (error) {
    return getActionError(error, "Checkout order creation failed.");
  }

  revalidatePath("/warenkorb");
  redirect(destination as Route);
}

export async function convertCheckoutGuest(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const password = parseGuestPassword(formData);

  if (!password) {
    return {
      message: "Das Passwort muss mindestens acht Zeichen lang sein.",
      status: "invalid",
    };
  }

  try {
    if (shouldUseShopwareMocks()) {
      await convertMockCheckoutGuest();
    } else {
      const session = await createCustomerSession();

      await convertShopwareGuest(session.client, password);
      await persistCustomerContext(session.getContextToken());
    }
  } catch (error) {
    return getActionError(error, "Guest account conversion failed.");
  }

  revalidatePath("/");
  redirect("/bestellung/danke?konto=erstellt");
}
