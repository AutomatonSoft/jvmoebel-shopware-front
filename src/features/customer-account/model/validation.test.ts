import { describe, expect, test } from "bun:test";

import {
  getCustomerEmailChangeFieldErrors,
  getCustomerLoginFieldErrors,
  getCustomerRegistrationFieldErrors,
  parseCustomerEmailChange,
  parseCustomerLogin,
  parseCustomerProfileUpdate,
  parseCustomerRegistration,
  parseCustomerSettingsUpdate,
  registrationInputSchema,
  validateCustomerRegistration,
  validateCustomerEmailChange,
  validateCustomerLogin,
} from "@/features/customer-account/model/validation";

function createRegistrationForm() {
  const formData = new FormData();

  formData.set("acceptedDataProtection", "on");
  formData.set("accountType", "private");
  formData.set("countryId", "country-de");
  formData.set("email", "kunde@example.com");
  formData.set("firstName", "Greta");
  formData.set("lastName", "Groß");
  formData.set("password", "sicheres-passwort");

  return formData;
}

describe("customer account validation", () => {
  test("parses login persistence separately from the credentials", () => {
    const formData = new FormData();

    formData.set("email", "kunde@example.com");
    formData.set("password", "geheim");
    expect(parseCustomerLogin(formData)).toEqual({
      email: "kunde@example.com",
      password: "geheim",
      rememberMe: false,
    });

    formData.set("rememberMe", "on");
    expect(parseCustomerLogin(formData)?.rememberMe).toBeTrue();
  });

  test("maps invalid login fields to user-facing messages", () => {
    const result = validateCustomerLogin(new FormData());

    expect(result.success).toBeFalse();
    if (!result.success) {
      expect(getCustomerLoginFieldErrors(result.error)).toEqual({
        email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        password: "Bitte geben Sie Ihr Passwort ein.",
      });
    }
  });

  test("parses the home24-style private registration fields", () => {
    const formData = createRegistrationForm();

    formData.set("salutationId", "salutation-mrs");

    expect(parseCustomerRegistration(formData)).toEqual({
      acceptedDataProtection: true,
      accountType: "private",
      company: undefined,
      countryId: "country-de",
      email: "kunde@example.com",
      firstName: "Greta",
      lastName: "Groß",
      password: "sicheres-passwort",
      salutationId: "salutation-mrs",
      vatId: undefined,
    });
  });

  test("accepts browser values for client-side registration validation", () => {
    expect(
      registrationInputSchema.safeParse({
        acceptedDataProtection: "on",
        accountType: "private",
        countryId: "country-de",
        email: "kunde@example.com",
        firstName: "Greta",
        lastName: "Groß",
        password: "sicheres-passwort",
        salutationId: "",
      }).success,
    ).toBeTrue();
  });

  test("requires company and tax number for a business registration", () => {
    const formData = createRegistrationForm();

    formData.set("accountType", "business");
    expect(parseCustomerRegistration(formData)).toBeNull();

    formData.set("company", "Muster GmbH");
    formData.set("vatId", "DE123456789");
    expect(parseCustomerRegistration(formData)).toMatchObject({
      accountType: "business",
      company: "Muster GmbH",
      vatId: "DE123456789",
    });
  });

  test("maps invalid registration fields to user-facing messages", () => {
    const formData = createRegistrationForm();

    formData.set("accountType", "business");
    formData.set("email", "invalid-email");
    const result = validateCustomerRegistration(formData);

    expect(result.success).toBeFalse();
    if (!result.success) {
      expect(getCustomerRegistrationFieldErrors(result.error)).toEqual({
        company: "Bitte geben Sie Ihren Firmennamen ein.",
        email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        vatId: "Bitte geben Sie Ihre Steuer- oder USt-IdNr. ein.",
      });
    }
  });

  test("normalizes a valid profile update and rejects an empty name", () => {
    const formData = new FormData();

    formData.set("firstName", " Greta ");
    formData.set("lastName", " GroÃŸ ");
    expect(parseCustomerProfileUpdate(formData)).toEqual({
      firstName: "Greta",
      lastName: "GroÃŸ",
    });

    formData.set("lastName", " ");
    expect(parseCustomerProfileUpdate(formData)).toBeNull();
  });

  test("requires a confirmed email and password for an email change", () => {
    const formData = new FormData();

    formData.set("email", " neue@example.com ");
    formData.set("emailConfirmation", "neue@example.com");
    formData.set("password", "geheim");
    expect(parseCustomerEmailChange(formData)).toEqual({
      email: "neue@example.com",
      emailConfirmation: "neue@example.com",
      password: "geheim",
    });

    formData.set("emailConfirmation", "andere@example.com");
    expect(parseCustomerEmailChange(formData)).toBeNull();
  });

  test("maps a mismatched email confirmation to the confirmation field", () => {
    const formData = new FormData();
    formData.set("email", "neue@example.com");
    formData.set("emailConfirmation", "andere@example.com");
    formData.set("password", "geheim");
    const result = validateCustomerEmailChange(formData);

    expect(result.success).toBeFalse();
    if (!result.success) {
      expect(getCustomerEmailChangeFieldErrors(result.error)).toEqual({
        emailConfirmation: "Die E-Mail-Adressen stimmen nicht überein.",
      });
    }
  });

  test("parses settings before checking a changed email", () => {
    const formData = new FormData();

    formData.set("currentEmail", "kunde@example.com");
    formData.set("email", "kunde@example.com");
    formData.set("firstName", " Greta ");
    formData.set("lastName", " GroÃŸ ");

    expect(parseCustomerSettingsUpdate(formData)).toEqual({
      currentEmail: "kunde@example.com",
      email: "kunde@example.com",
      firstName: "Greta",
      lastName: "GroÃŸ",
    });
  });
});
