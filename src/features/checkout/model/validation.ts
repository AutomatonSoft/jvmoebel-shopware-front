import { z, type ZodError } from "zod";

import type {
  CheckoutAddress,
  CheckoutActionState,
  CheckoutMethodSelection,
  GuestCheckoutRegistration,
} from "@/features/checkout/model/checkout";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requiredString(maxLength: number) {
  return z.string().trim().min(1).max(maxLength);
}

function optionalString(maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength)
    .transform((value) => value || undefined)
    .catch(undefined);
}

const emailSchema = requiredString(254).regex(emailPattern);

export const checkoutAddressSchema = z.object({
  additionalAddressLine1: optionalString(255),
  city: requiredString(255),
  countryId: requiredString(64),
  firstName: requiredString(255),
  lastName: requiredString(255),
  phoneNumber: optionalString(40),
  street: requiredString(255),
  zipcode: requiredString(50),
});

const guestCheckoutRegistrationSchema = z
  .object({
    acceptedDataProtection: z.literal(true),
    billingAddress: checkoutAddressSchema,
    email: emailSchema,
    shippingAddress: checkoutAddressSchema.optional(),
    shippingSameAsBilling: z.boolean(),
  })
  .refine(
    ({ shippingAddress, shippingSameAsBilling }) =>
      shippingSameAsBilling || Boolean(shippingAddress),
  )
  .transform(
    ({
      billingAddress,
      email,
      shippingAddress,
      shippingSameAsBilling,
    }): GuestCheckoutRegistration => ({
      acceptedDataProtection: true,
      billingAddress,
      email,
      shippingAddress: shippingSameAsBilling ? undefined : shippingAddress,
    }),
  );

const checkoutAddressFieldMessages = {
  city: "Bitte geben Sie Ihren Ort ein.",
  countryId: "Bitte wählen Sie ein Land aus.",
  firstName: "Bitte geben Sie Ihren Vornamen ein.",
  lastName: "Bitte geben Sie Ihren Nachnamen ein.",
  street: "Bitte geben Sie Straße und Hausnummer ein.",
  zipcode: "Bitte geben Sie Ihre Postleitzahl ein.",
} as const;

const guestCheckoutFieldMessages = {
  acceptedDataProtection: "Bitte stimmen Sie der Verarbeitung Ihrer Daten zu.",
  email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
} as const;

const checkoutMethodSelectionSchema = z.object({
  acceptedTerms: z.literal(true),
  customerComment: optionalString(1000),
  paymentMethodId: requiredString(64),
  shippingMethodId: requiredString(64),
});

const guestPasswordSchema = z.string().min(8).max(4096);

function getAddressInput(formData: FormData, prefix = "") {
  return {
    additionalAddressLine1: formData.get(`${prefix}additionalAddressLine1`),
    city: formData.get(`${prefix}city`),
    countryId: formData.get(`${prefix}countryId`),
    firstName: formData.get(`${prefix}firstName`),
    lastName: formData.get(`${prefix}lastName`),
    phoneNumber: formData.get(`${prefix}phoneNumber`),
    street: formData.get(`${prefix}street`),
    zipcode: formData.get(`${prefix}zipcode`),
  };
}

function getGuestCheckoutRegistrationInput(formData: FormData) {
  const shippingSameAsBilling = formData.get("shippingSameAsBilling") === "on";

  return {
    acceptedDataProtection: formData.get("acceptedDataProtection") === "on",
    billingAddress: getAddressInput(formData),
    email: formData.get("email"),
    shippingAddress: shippingSameAsBilling
      ? undefined
      : getAddressInput(formData, "shipping"),
    shippingSameAsBilling,
  };
}

export function validateGuestCheckoutRegistration(formData: FormData) {
  return guestCheckoutRegistrationSchema.safeParse(
    getGuestCheckoutRegistrationInput(formData),
  );
}

export function getGuestCheckoutRegistrationFieldErrors(error: ZodError) {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const [address, field] = issue.path;

    if (
      (address === "billingAddress" || address === "shippingAddress") &&
      typeof field === "string" &&
      field in checkoutAddressFieldMessages
    ) {
      const name = `${address === "shippingAddress" ? "shipping" : ""}${field}`;

      fieldErrors[name] ??=
        checkoutAddressFieldMessages[
          field as keyof typeof checkoutAddressFieldMessages
        ];
      continue;
    }

    if (typeof address === "string" && address in guestCheckoutFieldMessages) {
      fieldErrors[address] ??=
        guestCheckoutFieldMessages[
          address as keyof typeof guestCheckoutFieldMessages
        ];
    }
  }

  return fieldErrors satisfies NonNullable<CheckoutActionState["fieldErrors"]>;
}

export function parseCheckoutAddress(
  formData: FormData,
  prefix = "",
): CheckoutAddress | null {
  const result = checkoutAddressSchema.safeParse(
    getAddressInput(formData, prefix),
  );

  return result.success ? result.data : null;
}

export function parseGuestCheckoutRegistration(
  formData: FormData,
): GuestCheckoutRegistration | null {
  const result = validateGuestCheckoutRegistration(formData);

  return result.success ? result.data : null;
}

export function parseCheckoutMethodSelection(
  formData: FormData,
): CheckoutMethodSelection | null {
  const result = checkoutMethodSelectionSchema.safeParse({
    acceptedTerms: formData.get("acceptedTerms") === "on",
    customerComment: formData.get("customerComment"),
    paymentMethodId: formData.get("paymentMethodId"),
    shippingMethodId: formData.get("shippingMethodId"),
  });

  return result.success ? result.data : null;
}

export function parseGuestPassword(formData: FormData) {
  const result = guestPasswordSchema.safeParse(formData.get("password"));

  return result.success ? result.data : null;
}
