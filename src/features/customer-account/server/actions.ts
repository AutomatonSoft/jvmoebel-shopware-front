"use server";

import { ApiClientError, type ApiError } from "@shopware/api-client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import type { AccountActionState } from "@/features/customer-account/model/account";
import { clearCheckoutMethodSelection } from "@/features/checkout/server/method-selection";
import {
  customerRegistrationFieldMessages,
  getCustomerEmailChangeFieldErrors,
  getCustomerLoginFieldErrors,
  getCustomerProfileUpdateFieldErrors,
  getCustomerRegistrationFieldErrors,
  getCustomerRegistrationValidationMessage,
  getCustomerSettingsUpdateFieldErrors,
  validateCustomerEmailChange,
  validateCustomerLogin,
  validateCustomerProfileUpdate,
  validateCustomerSettingsUpdate,
  validateCustomerRegistration,
} from "@/features/customer-account/model/validation";
import { getRegistrationOptions } from "@/features/customer-account/server/account";
import {
  clearCustomerContext,
  createCustomerSession,
  persistCustomerContext,
} from "@/features/customer-account/server/session";
import {
  confirmShopwareCustomerRegistration,
  loginShopwareCustomer,
  logoutShopwareCustomer,
  registerShopwareCustomer,
} from "@/integrations/shopware/customer-account";
import { subscribeToShopwareNewsletter } from "@/integrations/shopware/newsletter";
import {
  getCheckoutAddressFieldErrors,
  validateCheckoutAddress,
} from "@/features/checkout/model/validation";
import {
  getShopwareCheckoutOptions,
  updateShopwareCustomerAddress,
} from "@/integrations/shopware/checkout";

function getRedirectPath(formData: FormData) {
  const redirectTo = formData.get("redirectTo");

  return redirectTo === "/warenkorb" || redirectTo === "/kasse"
    ? redirectTo
    : null;
}

const registrationApiFieldMessages = {
  company: "Der Firmenname wurde von Shopware nicht akzeptiert.",
  email:
    "Diese E-Mail-Adresse ist bereits registriert oder kann nicht verwendet werden.",
  firstName: "Der Vorname wurde von Shopware nicht akzeptiert.",
  lastName: "Der Nachname wurde von Shopware nicht akzeptiert.",
  password: "Das Passwort erfüllt die Anforderungen von Shopware nicht.",
  salutationId: "Die gewählte Anrede ist nicht gültig.",
  vatId: "Die Steuer- oder USt-IdNr. wurde von Shopware nicht akzeptiert.",
} as const;

function getRegistrationApiErrorState(
  error: ApiClientError<{ errors: ApiError[] }>,
) {
  const fieldErrors: Record<string, string> = {};

  for (const apiError of error.details.errors) {
    const pointer = apiError.source?.pointer?.toLowerCase() ?? "";
    const code = apiError.code?.toLowerCase() ?? "";

    for (const [field, message] of Object.entries(
      registrationApiFieldMessages,
    )) {
      const apiField = field === "vatId" ? "vatids" : field.toLowerCase();

      if (pointer.includes(apiField) || code.includes(apiField)) {
        fieldErrors[field] ??= message;
      }
    }
  }

  if (Object.keys(fieldErrors).length === 0) {
    return {
      message:
        "Shopware hat die Registrierung abgelehnt. Die übermittelten Daten erfüllen die Anforderungen des Shops nicht.",
      status: "invalid" as const,
    };
  }

  return {
    fieldErrors,
    message: getCustomerRegistrationValidationMessage(fieldErrors),
    status: "invalid" as const,
  };
}

export async function loginCustomer(
  _previousState: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const validation = validateCustomerLogin(formData);
  const redirectPath = getRedirectPath(formData);

  if (!validation.success) {
    return {
      fieldErrors: getCustomerLoginFieldErrors(validation.error),
      message:
        "Bitte geben Sie eine gültige E-Mail-Adresse und Ihr Passwort ein.",
      status: "invalid",
    };
  }

  const login = validation.data;

  try {
    const session = await createCustomerSession();

    await loginShopwareCustomer(session.client, login);
    await persistCustomerContext(session.getContextToken(), {
      persistent: login.rememberMe,
    });
  } catch (error) {
    if (error instanceof ApiClientError && [400, 401].includes(error.status)) {
      return {
        message: "E-Mail-Adresse oder Passwort ist nicht korrekt.",
        status: "invalid",
      };
    }

    console.error("Customer login failed.", error);

    return {
      message:
        "Die Anmeldung ist gerade nicht möglich. Bitte versuchen Sie es erneut.",
      status: "error",
    };
  }

  redirect(redirectPath ?? "/kundenkonto?angemeldet=1");
}

export async function registerCustomer(
  _previousState: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  let options: Awaited<ReturnType<typeof getRegistrationOptions>>;

  try {
    options = await getRegistrationOptions();
  } catch (error) {
    console.error("Customer registration options could not be loaded.", error);

    return {
      message:
        "Die Registrierung ist gerade nicht möglich. Bitte versuchen Sie es erneut.",
      status: "error",
    };
  }

  formData.set("countryId", options.defaultCountryId);

  const validation = validateCustomerRegistration(formData);

  if (!validation.success) {
    const fieldErrors = getCustomerRegistrationFieldErrors(validation.error);

    return {
      fieldErrors,
      message: getCustomerRegistrationValidationMessage(fieldErrors),
      status: "invalid",
    };
  }

  const registration = validation.data;

  try {
    if (
      registration.salutationId &&
      !options.salutations.some(
        (salutation) => salutation.id === registration.salutationId,
      )
    ) {
      const message = customerRegistrationFieldMessages.salutationId;

      return {
        fieldErrors: { salutationId: message },
        message,
        status: "invalid",
      };
    }

    const session = await createCustomerSession();

    await registerShopwareCustomer(session.client, registration);
    if (registration.newsletterConsent) {
      try {
        const outcome = await subscribeToShopwareNewsletter(session.client, {
          email: registration.email,
        });

        if (!outcome.success) {
          console.error(
            "Newsletter subscription was not accepted by Shopware.",
            {
              email: registration.email,
              status: outcome.status,
            },
          );
        }
      } catch (error) {
        console.error(
          "Newsletter subscription failed after registration.",
          error,
        );
      }
    }
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 400) {
      return getRegistrationApiErrorState(error);
    }

    console.error("Customer registration failed.", error);

    return {
      message:
        "Die Registrierung ist gerade nicht möglich. Bitte versuchen Sie es erneut.",
      status: "error",
    };
  }

  redirect(
    `/kundenkonto/email-bestaetigen?email=${encodeURIComponent(registration.email)}`,
  );
}

export async function confirmCustomerRegistration(
  confirmation: Readonly<{ em?: string; hash?: string }>,
) {
  if (!confirmation.em || !confirmation.hash) {
    return { status: "invalid" as const };
  }

  try {
    const session = await createCustomerSession();

    await confirmShopwareCustomerRegistration(session.client, {
      em: confirmation.em,
      hash: confirmation.hash,
    });
    await persistCustomerContext(session.getContextToken());

    return { status: "success" as const };
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 412) {
      return { status: "already-confirmed" as const };
    }

    console.error("Customer registration confirmation failed.", error);
    return { status: "invalid" as const };
  }
}

export async function logoutCustomer() {
  try {
    const session = await createCustomerSession();

    await logoutShopwareCustomer(session.client);
  } catch (error) {
    console.error("Customer logout failed.", error);
  } finally {
    await Promise.all([clearCheckoutMethodSelection(), clearCustomerContext()]);
  }

  redirect("/kundenkonto/anmelden");
}

export async function saveCustomerProfile(
  _previousState: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const validation = validateCustomerProfileUpdate(formData);

  if (!validation.success) {
    return {
      fieldErrors: getCustomerProfileUpdateFieldErrors(validation.error),
      message: "Bitte prüfen Sie Ihren Namen.",
      status: "invalid",
    };
  }

  const profile = validation.data;

  try {
    const session = await createCustomerSession();

    await session.client.invoke("changeProfile post /account/change-profile", {
      body: profile,
      fetchOptions: { cache: "no-store" },
    });
    await persistCustomerContext(session.getContextToken());
  } catch (error) {
    console.error("Customer profile update failed.", error);
    return {
      message: "Ihr Profil konnte nicht gespeichert werden.",
      status: "error",
    };
  }

  revalidatePath("/kundenkonto");
  revalidatePath("/kundenkonto/profil");
  redirect("/kundenkonto?profil=1");
}

export async function changeCustomerEmail(
  _previousState: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const validation = validateCustomerEmailChange(formData);

  if (!validation.success) {
    return {
      fieldErrors: getCustomerEmailChangeFieldErrors(validation.error),
      message: "Bitte prüfen Sie E-Mail-Adresse und Passwort.",
      status: "invalid",
    };
  }

  const emailChange = validation.data;

  try {
    const session = await createCustomerSession();

    await session.client.invoke("changeEmail post /account/change-email", {
      body: emailChange,
      fetchOptions: { cache: "no-store" },
    });
    await persistCustomerContext(session.getContextToken());
  } catch (error) {
    console.error("Customer email update failed.", error);
    return {
      message: "Die E-Mail-Adresse konnte nicht geändert werden.",
      status: "error",
    };
  }

  revalidatePath("/kundenkonto");
  redirect("/kundenkonto?email=1");
}

export async function saveCustomerSettings(
  _previousState: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const validation = validateCustomerSettingsUpdate(formData);

  if (!validation.success) {
    return {
      fieldErrors: getCustomerSettingsUpdateFieldErrors(validation.error),
      message: "Bitte prüfen Sie Ihre Angaben.",
      status: "invalid",
    };
  }

  const settings = validation.data;
  const emailChangeValidation =
    settings.email.trim() === settings.currentEmail
      ? null
      : validateCustomerEmailChange(formData);

  if (emailChangeValidation && !emailChangeValidation.success) {
    return {
      fieldErrors: getCustomerEmailChangeFieldErrors(
        emailChangeValidation.error,
      ),
      message: "Bitte bestätigen Sie die neue E-Mail-Adresse und Ihr Passwort.",
      status: "invalid",
    };
  }

  try {
    const session = await createCustomerSession();
    await session.client.invoke("changeProfile post /account/change-profile", {
      body: { firstName: settings.firstName, lastName: settings.lastName },
      fetchOptions: { cache: "no-store" },
    });
    if (emailChangeValidation) {
      await session.client.invoke("changeEmail post /account/change-email", {
        body: emailChangeValidation.data,
        fetchOptions: { cache: "no-store" },
      });
    }
    await persistCustomerContext(session.getContextToken());
  } catch (error) {
    console.error("Customer settings update failed.", error);
    return {
      message: "Ihre Änderungen konnten nicht gespeichert werden.",
      status: "error",
    };
  }
  revalidatePath("/kundenkonto");
  redirect("/kundenkonto?einstellungen=1");
}

export async function saveCustomerAccountAddress(
  _previousState: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const validation = validateCheckoutAddress(formData);

  if (!validation.success) {
    return {
      fieldErrors: getCheckoutAddressFieldErrors(validation.error),
      message: "Bitte füllen Sie alle Pflichtfelder aus.",
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
    console.error("Customer account address update failed.", error);
    return {
      message: "Ihre Adresse konnte nicht gespeichert werden.",
      status: "error",
    };
  }

  revalidatePath("/kundenkonto");
  revalidatePath("/kundenkonto/adressen");
  redirect("/kundenkonto?adresse=1");
}
