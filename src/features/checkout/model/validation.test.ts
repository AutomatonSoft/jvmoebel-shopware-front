import { describe, expect, test } from "bun:test";

import {
  getCheckoutMethodSelectionFieldErrors,
  getCheckoutOrderConfirmationFieldErrors,
  getGuestCheckoutRegistrationFieldErrors,
  getGuestPasswordFieldErrors,
  guestCheckoutRegistrationSchema,
  parseCheckoutMethodSelection,
  parseGuestCheckoutRegistration,
  parseGuestPassword,
  validateGuestCheckoutRegistration,
  validateCheckoutMethodSelection,
  validateCheckoutOrderConfirmation,
  validateGuestPassword,
} from "@/features/checkout/model/validation";

function createGuestForm() {
  return new FormData();
}

describe("checkout validation", () => {
  test("parses a guest with a shared billing and shipping address", () => {
    const formData = createGuestForm();

    formData.set("acceptedDataProtection", "on");
    formData.set("shippingSameAsBilling", "on");
    formData.set("email", "gast@example.com");
    formData.set("billingAddress.firstName", "Greta");
    formData.set("billingAddress.lastName", "Groß");
    formData.set("billingAddress.street", "Musterstraße 8");
    formData.set("billingAddress.zipcode", "50667");
    formData.set("billingAddress.city", "Köln");
    formData.set("billingAddress.countryId", "country-de");

    expect(parseGuestCheckoutRegistration(formData)).toEqual({
      acceptedDataProtection: true,
      billingAddress: {
        additionalAddressLine1: undefined,
        city: "Köln",
        countryId: "country-de",
        firstName: "Greta",
        lastName: "Groß",
        phoneNumber: undefined,
        street: "Musterstraße 8",
        zipcode: "50667",
      },
      email: "gast@example.com",
      shippingAddress: undefined,
    });
  });

  test("accepts browser values for client-side guest checkout validation", () => {
    expect(
      guestCheckoutRegistrationSchema.safeParse({
        acceptedDataProtection: "on",
        billingAddress: {
          additionalAddressLine1: "",
          city: "Köln",
          countryId: "country-de",
          firstName: "Greta",
          lastName: "Groß",
          phoneNumber: "",
          street: "Musterstraße 8",
          zipcode: "50667",
        },
        email: "gast@example.com",
        shippingSameAsBilling: true,
      }).success,
    ).toBeTrue();
  });

  test("requires a complete separate shipping address", () => {
    const formData = createGuestForm();

    formData.set("acceptedDataProtection", "on");
    formData.set("email", "gast@example.com");
    formData.set("billingAddress.firstName", "Greta");
    formData.set("billingAddress.lastName", "Groß");
    formData.set("billingAddress.street", "Musterstraße 8");
    formData.set("billingAddress.zipcode", "50667");
    formData.set("billingAddress.city", "Köln");
    formData.set("billingAddress.countryId", "country-de");

    expect(parseGuestCheckoutRegistration(formData)).toBeNull();
  });

  test("maps invalid guest checkout fields to their form names", () => {
    const formData = createGuestForm();

    formData.set("shippingSameAsBilling", "on");
    formData.set("email", "invalid-email");
    const result = validateGuestCheckoutRegistration(formData);

    expect(result.success).toBeFalse();
    if (!result.success) {
      expect(
        getGuestCheckoutRegistrationFieldErrors(result.error),
      ).toMatchObject({
        acceptedDataProtection:
          "Bitte stimmen Sie der Verarbeitung Ihrer Daten zu.",
        "billingAddress.city": "Bitte geben Sie Ihren Ort ein.",
        email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        "billingAddress.firstName": "Bitte geben Sie Ihren Vornamen ein.",
      });
    }
  });

  test("parses the selected delivery and payment methods", () => {
    const formData = new FormData();

    formData.set("paymentMethodId", "payment-id");
    formData.set("shippingMethodId", "shipping-id");
    formData.set("customerComment", "Bitte vorher anrufen.");

    expect(parseCheckoutMethodSelection(formData)).toEqual({
      customerComment: "Bitte vorher anrufen.",
      paymentMethodId: "payment-id",
      shippingMethodId: "shipping-id",
    });
  });

  test("maps missing delivery and payment methods to their fields", () => {
    const result = validateCheckoutMethodSelection(new FormData());

    expect(result.success).toBeFalse();
    if (!result.success) {
      expect(getCheckoutMethodSelectionFieldErrors(result.error)).toEqual({
        paymentMethodId: "Bitte wählen Sie eine Zahlungsart aus.",
        shippingMethodId: "Bitte wählen Sie eine Versandart aus.",
      });
    }
  });

  test("requires accepting the terms when confirming the order", () => {
    const result = validateCheckoutOrderConfirmation(new FormData());

    expect(result.success).toBeFalse();
    if (!result.success) {
      expect(getCheckoutOrderConfirmationFieldErrors(result.error)).toEqual({
        acceptedTerms: "Bitte stimmen Sie den Bedingungen zu.",
      });
    }
  });

  test("requires at least eight characters when converting a guest", () => {
    const formData = new FormData();

    formData.set("password", "kurz");
    expect(parseGuestPassword(formData)).toBeNull();

    formData.set("password", "sicheres-passwort");
    expect(parseGuestPassword(formData)).toBe("sicheres-passwort");
  });

  test("maps an invalid guest password to the password field", () => {
    const formData = new FormData();
    formData.set("password", "kurz");
    const result = validateGuestPassword(formData);

    expect(result.success).toBeFalse();
    if (!result.success) {
      expect(getGuestPasswordFieldErrors(result.error)).toEqual({
        password: "Das Passwort muss mindestens acht Zeichen lang sein.",
      });
    }
  });
});
