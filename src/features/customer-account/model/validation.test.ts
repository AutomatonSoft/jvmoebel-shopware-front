import { describe, expect, test } from "bun:test";

import {
  parseCustomerLogin,
  parseCustomerRegistration,
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
});
