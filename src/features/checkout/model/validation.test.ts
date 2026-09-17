import { describe, expect, test } from "bun:test";

import {
  parseCheckoutMethodSelection,
  parseGuestCheckoutRegistration,
  parseGuestPassword,
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
    formData.set("firstName", "Greta");
    formData.set("lastName", "Groß");
    formData.set("street", "Musterstraße 8");
    formData.set("zipcode", "50667");
    formData.set("city", "Köln");
    formData.set("countryId", "country-de");

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

  test("requires a complete separate shipping address", () => {
    const formData = createGuestForm();

    formData.set("acceptedDataProtection", "on");
    formData.set("email", "gast@example.com");
    formData.set("firstName", "Greta");
    formData.set("lastName", "Groß");
    formData.set("street", "Musterstraße 8");
    formData.set("zipcode", "50667");
    formData.set("city", "Köln");
    formData.set("countryId", "country-de");

    expect(parseGuestCheckoutRegistration(formData)).toBeNull();
  });

  test("parses the selected delivery and payment methods", () => {
    const formData = new FormData();

    formData.set("acceptedTerms", "on");
    formData.set("paymentMethodId", "payment-id");
    formData.set("shippingMethodId", "shipping-id");
    formData.set("customerComment", "Bitte vorher anrufen.");

    expect(parseCheckoutMethodSelection(formData)).toEqual({
      acceptedTerms: true,
      customerComment: "Bitte vorher anrufen.",
      paymentMethodId: "payment-id",
      shippingMethodId: "shipping-id",
    });
  });

  test("requires at least eight characters when converting a guest", () => {
    const formData = new FormData();

    formData.set("password", "kurz");
    expect(parseGuestPassword(formData)).toBeNull();

    formData.set("password", "sicheres-passwort");
    expect(parseGuestPassword(formData)).toBe("sicheres-passwort");
  });
});
