"use server";

import { ApiClientError } from "@shopware/api-client";
import { redirect } from "next/navigation";

import type { AccountActionState } from "@/features/customer-account/model/account";
import {
  parseCustomerLogin,
  parseCustomerRegistration,
} from "@/features/customer-account/model/validation";
import {
  clearCustomerContext,
  createCustomerSession,
  persistCustomerContext,
} from "@/features/customer-account/server/session";
import {
  loginShopwareCustomer,
  logoutShopwareCustomer,
  registerShopwareCustomer,
} from "@/integrations/shopware/customer-account";

function getRedirectPath(formData: FormData) {
  return formData.get("redirectTo") === "/warenkorb" ? "/warenkorb" : null;
}

export async function loginCustomer(
  _previousState: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const login = parseCustomerLogin(formData);
  const redirectPath = getRedirectPath(formData);

  if (!login) {
    return {
      message:
        "Bitte geben Sie eine gültige E-Mail-Adresse und Ihr Passwort ein.",
      status: "invalid",
    };
  }

  try {
    const session = await createCustomerSession();

    await loginShopwareCustomer(session.client, login);
    await persistCustomerContext(session.getContextToken());
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
  const registration = parseCustomerRegistration(formData);
  const redirectPath = getRedirectPath(formData);

  if (!registration) {
    return {
      message: "Bitte prüfen Sie Ihre Angaben.",
      status: "invalid",
    };
  }

  try {
    const session = await createCustomerSession();

    await registerShopwareCustomer(session.client, registration);
    await persistCustomerContext(session.getContextToken());
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 400) {
      return {
        message:
          "Das Konto konnte mit diesen Angaben nicht erstellt werden. Möglicherweise ist die E-Mail-Adresse bereits registriert.",
        status: "invalid",
      };
    }

    console.error("Customer registration failed.", error);

    return {
      message:
        "Die Registrierung ist gerade nicht möglich. Bitte versuchen Sie es erneut.",
      status: "error",
    };
  }

  redirect(redirectPath ?? "/kundenkonto?registriert=1");
}

export async function logoutCustomer() {
  try {
    const session = await createCustomerSession();

    await logoutShopwareCustomer(session.client);
  } catch (error) {
    console.error("Customer logout failed.", error);
  } finally {
    await clearCustomerContext();
  }

  redirect("/kundenkonto/anmelden");
}
