"use server";

import { ApiClientError } from "@shopware/api-client";
import type { Route } from "next";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clearMockCart } from "@/features/cart/server/mock-cart";
import type { CheckoutActionState } from "@/features/checkout/model/checkout";
import {
  getCheckoutAddressFieldErrors,
  getCheckoutEmailUpdateFieldErrors,
  getCheckoutOrderConfirmationFieldErrors,
  getCheckoutMethodSelectionFieldErrors,
  getGuestCheckoutRegistrationFieldErrors,
  getGuestPasswordFieldErrors,
  validateCheckoutAddress,
  validateCheckoutEmailUpdate,
  validateCheckoutOrderConfirmation,
  validateCheckoutMethodSelection,
  validateGuestCheckoutRegistration,
  validateGuestPassword,
} from "@/features/checkout/model/validation";
import {
  addMockCheckoutBillingAddress,
  addMockCheckoutDeliveryAddress,
  convertMockCheckoutGuest,
  createMockCheckoutReceipt,
  mockCheckoutOptions,
  registerMockCheckoutGuest,
  selectMockCheckoutDeliveryAddress,
} from "@/features/checkout/server/mock-checkout";
import {
  getCheckoutMethodSelection,
  persistCheckoutMethodSelection,
} from "@/features/checkout/server/method-selection";
import { persistCheckoutReceipt } from "@/features/checkout/server/receipt";
import { getShopCart } from "@/features/cart/server/cart";
import {
  createCustomerSession,
  persistCustomerContext,
} from "@/features/customer-account/server/session";
import {
  convertShopwareGuest,
  createShopwareCheckoutBillingAddress,
  createShopwareCheckoutDeliveryAddress,
  createShopwareCheckoutOrder,
  getShopwareCheckoutCustomer,
  getShopwareCheckoutOptions,
  registerShopwareGuest,
  selectShopwareCheckoutDeliveryAddress,
  updateShopwareCheckoutMethodSelection,
  updateShopwareCheckoutDeliveryAddress,
  updateShopwareCustomerAddress,
} from "@/integrations/shopware/checkout";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";

function optionsContainCountry(
  countryIds: readonly string[],
  availableIds: readonly string[],
) {
  return countryIds.every((id) => availableIds.includes(id));
}

function optionsContainMethodSelection(
  selection: Readonly<{
    paymentMethodId: string;
    shippingMethodId: string;
  }>,
  options: Readonly<{
    paymentMethods: readonly { id: string }[];
    shippingMethods: readonly { id: string }[];
  }>,
) {
  return (
    options.paymentMethods.some(
      (method) => method.id === selection.paymentMethodId,
    ) &&
    options.shippingMethods.some(
      (method) => method.id === selection.shippingMethodId,
    )
  );
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

function getCheckoutReturnPath(formData: FormData): Route {
  return formData.get("returnTo") === "/kasse?schritt=bestaetigung"
    ? "/kasse?schritt=bestaetigung"
    : "/kasse?schritt=zahlung";
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
  const validation = validateCheckoutAddress(formData);

  if (!validation.success) {
    return {
      fieldErrors: getCheckoutAddressFieldErrors(validation.error),
      message: "Bitte füllen Sie alle Pflichtfelder vollständig aus.",
      status: "invalid",
    };
  }

  const address = validation.data;

  try {
    const session = await createCustomerSession();
    const options = await getShopwareCheckoutOptions(session.client);

    if (
      !options.countries.some((country) => country.id === address.countryId)
    ) {
      return {
        fieldErrors: { countryId: "Bitte wählen Sie ein gültiges Land." },
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
  redirect(getCheckoutReturnPath(formData));
}

export async function addCustomerCheckoutDeliveryAddress(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const validation = validateCheckoutAddress(formData);

  if (!validation.success) {
    return {
      fieldErrors: getCheckoutAddressFieldErrors(validation.error),
      message: "Bitte füllen Sie alle Pflichtfelder vollständig aus.",
      status: "invalid",
    };
  }

  const address = validation.data;

  try {
    if (shouldUseShopwareMocks()) {
      await addMockCheckoutDeliveryAddress(address);
    } else {
      const session = await createCustomerSession();
      const options = await getShopwareCheckoutOptions(session.client);

      if (
        !options.countries.some((country) => country.id === address.countryId)
      ) {
        return {
          fieldErrors: { countryId: "Bitte wählen Sie ein gültiges Land." },
          message: "Bitte wählen Sie ein gültiges Land.",
          status: "invalid",
        };
      }

      await createShopwareCheckoutDeliveryAddress(session.client, address);
      await persistCustomerContext(session.getContextToken());
    }
  } catch (error) {
    return getActionError(error, "Customer delivery address creation failed.");
  }

  revalidatePath("/kasse");
  redirect(getCheckoutReturnPath(formData));
}

export async function addCustomerCheckoutBillingAddress(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const validation = validateCheckoutAddress(formData);

  if (!validation.success) {
    return {
      fieldErrors: getCheckoutAddressFieldErrors(validation.error),
      message: "Bitte füllen Sie alle Pflichtfelder vollständig aus.",
      status: "invalid",
    };
  }

  const address = validation.data;

  try {
    if (shouldUseShopwareMocks()) {
      await addMockCheckoutBillingAddress(address);
    } else {
      const session = await createCustomerSession();
      const options = await getShopwareCheckoutOptions(session.client);

      if (
        !options.countries.some((country) => country.id === address.countryId)
      ) {
        return {
          fieldErrors: { countryId: "Bitte wählen Sie ein gültiges Land." },
          message: "Bitte wählen Sie ein gültiges Land.",
          status: "invalid",
        };
      }

      await createShopwareCheckoutBillingAddress(session.client, address);
      await persistCustomerContext(session.getContextToken());
    }
  } catch (error) {
    return getActionError(error, "Customer billing address creation failed.");
  }

  revalidatePath("/kasse");
  redirect(getCheckoutReturnPath(formData));
}

export async function saveCustomerCheckoutDeliveryAddress(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const validation = validateCheckoutAddress(formData);

  if (!validation.success) {
    return {
      fieldErrors: getCheckoutAddressFieldErrors(validation.error),
      message: "Bitte füllen Sie alle Pflichtfelder vollständig aus.",
      status: "invalid",
    };
  }

  const address = validation.data;

  try {
    const session = await createCustomerSession();
    const options = await getShopwareCheckoutOptions(session.client);

    if (
      !options.countries.some((country) => country.id === address.countryId)
    ) {
      return {
        fieldErrors: { countryId: "Bitte wählen Sie ein gültiges Land." },
        message: "Bitte wählen Sie ein gültiges Land.",
        status: "invalid",
      };
    }

    await updateShopwareCheckoutDeliveryAddress(session.client, address);
    await persistCustomerContext(session.getContextToken());
  } catch (error) {
    return getActionError(error, "Customer delivery address update failed.");
  }

  revalidatePath("/kasse");
  redirect(getCheckoutReturnPath(formData));
}

export async function saveCheckoutEmail(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const validation = validateCheckoutEmailUpdate(formData);

  if (!validation.success) {
    return {
      fieldErrors: getCheckoutEmailUpdateFieldErrors(validation.error),
      message: "Bitte prüfen Sie Ihre E-Mail-Adresse.",
      status: "invalid",
    };
  }

  const emailChange = validation.data;

  try {
    const session = await createCustomerSession();
    const customer = await getShopwareCheckoutCustomer(session.client);

    if (!customer) {
      throw new Error("The checkout customer is missing.");
    }

    if (!customer.guest && !emailChange.password) {
      return {
        fieldErrors: {
          password: "Bitte geben Sie Ihr aktuelles Passwort ein.",
        },
        message: "Bitte bestätigen Sie Ihr Passwort.",
        status: "invalid",
      };
    }

    await session.client.invoke("changeEmail post /account/change-email", {
      body: emailChange,
      fetchOptions: { cache: "no-store" },
    });
    await persistCustomerContext(session.getContextToken());
  } catch (error) {
    return getActionError(error, "Checkout email update failed.");
  }

  revalidatePath("/kasse");
  redirect(getCheckoutReturnPath(formData));
}

export async function selectCustomerCheckoutDeliveryAddress(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const addressId = formData.get("shippingAddressId");

  if (typeof addressId !== "string" || !addressId) {
    return {
      message: "Bitte wählen Sie eine Lieferadresse.",
      status: "invalid",
    };
  }

  try {
    if (shouldUseShopwareMocks()) {
      await selectMockCheckoutDeliveryAddress(addressId);
    } else {
      const session = await createCustomerSession();

      await selectShopwareCheckoutDeliveryAddress(session.client, addressId);
      await persistCustomerContext(session.getContextToken());
    }
  } catch (error) {
    return getActionError(error, "Customer delivery address selection failed.");
  }

  revalidatePath("/kasse");
  redirect("/kasse?schritt=zahlung");
}

export async function saveCheckoutMethodSelection(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const validation = validateCheckoutMethodSelection(formData);

  if (!validation.success) {
    return {
      fieldErrors: getCheckoutMethodSelectionFieldErrors(validation.error),
      message: "Bitte wählen Sie Versand und Zahlung.",
      status: "invalid",
    };
  }

  const selection = validation.data;

  try {
    if (shouldUseShopwareMocks()) {
      if (!optionsContainMethodSelection(selection, mockCheckoutOptions)) {
        return {
          message:
            "Die gewählte Versand- oder Zahlungsart ist nicht mehr verfügbar.",
          status: "invalid",
        };
      }
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

      if (!optionsContainMethodSelection(selection, options)) {
        return {
          message:
            "Die gewählte Versand- oder Zahlungsart ist nicht mehr verfügbar.",
          status: "invalid",
        };
      }

      await updateShopwareCheckoutMethodSelection(session.client, selection);
      await persistCustomerContext(session.getContextToken());
    }

    await persistCheckoutMethodSelection(selection);
  } catch (error) {
    return getActionError(error, "Checkout method selection failed.");
  }

  revalidatePath("/kasse");
  redirect("/kasse?schritt=bestaetigung");
}

export async function placeCheckoutOrder(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const confirmation = validateCheckoutOrderConfirmation(formData);

  if (!confirmation.success) {
    return {
      fieldErrors: getCheckoutOrderConfirmationFieldErrors(confirmation.error),
      message: "Bitte bestätigen Sie die Bedingungen.",
      status: "invalid",
    };
  }

  const selection = await getCheckoutMethodSelection();

  if (!selection) {
    return {
      message: "Bitte wählen Sie zuerst Versand und Zahlung.",
      status: "invalid",
    };
  }

  let destination = "/bestellung/danke";

  try {
    if (shouldUseShopwareMocks()) {
      if (!optionsContainMethodSelection(selection, mockCheckoutOptions)) {
        return {
          message:
            "Die gewählte Versand- oder Zahlungsart ist nicht mehr verfügbar.",
          status: "invalid",
        };
      }

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

      if (!optionsContainMethodSelection(selection, options)) {
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

export async function placeGuestCheckoutOrder(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const registration = validateGuestCheckoutRegistration(formData);
  const selection = validateCheckoutMethodSelection(formData);
  const confirmation = validateCheckoutOrderConfirmation(formData);

  if (!registration.success || !selection.success || !confirmation.success) {
    return {
      message:
        "Bitte prüfen Sie Ihre Angaben und bestätigen Sie die Bedingungen.",
      status: "invalid",
    };
  }

  let destination = "/bestellung/danke";

  try {
    const session = await createCustomerSession();
    const options = await getShopwareCheckoutOptions(session.client);
    const countryIds = [
      registration.data.billingAddress.countryId,
      ...(registration.data.shippingAddress
        ? [registration.data.shippingAddress.countryId]
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

    await registerShopwareGuest(session.client, registration.data);
    const checkoutOptions = await getShopwareCheckoutOptions(session.client);

    if (!optionsContainMethodSelection(selection.data, checkoutOptions)) {
      return {
        message:
          "Die gewählte Versand- oder Zahlungsart ist nicht mehr verfügbar.",
        status: "invalid",
      };
    }

    const origin = await getRequestOrigin();
    const result = await createShopwareCheckoutOrder(
      session.client,
      selection.data,
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
  } catch (error) {
    return getActionError(error, "Guest checkout order creation failed.");
  }

  revalidatePath("/warenkorb");
  redirect(destination as Route);
}

export async function convertCheckoutGuest(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const validation = validateGuestPassword(formData);

  if (!validation.success) {
    return {
      fieldErrors: getGuestPasswordFieldErrors(validation.error),
      message: "Das Passwort muss mindestens acht Zeichen lang sein.",
      status: "invalid",
    };
  }

  const password = validation.data;

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
