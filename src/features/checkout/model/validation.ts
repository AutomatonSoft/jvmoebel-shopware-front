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

export const guestCheckoutRegistrationSchema = z
  .object({
    acceptedDataProtection: z.union([z.literal(true), z.literal("on")]),
    billingAddress: checkoutAddressSchema,
    email: emailSchema,
    shippingAddress: checkoutAddressSchema.optional(),
    shippingSameAsBilling: z.union([
      z.literal(true),
      z.literal(false),
      z.literal("on"),
    ]),
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

export const checkoutAddressFieldMessages = {
  city: "Bitte geben Sie Ihren Ort ein.",
  countryId: "Bitte wählen Sie ein Land aus.",
  firstName: "Bitte geben Sie Ihren Vornamen ein.",
  lastName: "Bitte geben Sie Ihren Nachnamen ein.",
  street: "Bitte geben Sie Straße und Hausnummer ein.",
  zipcode: "Bitte geben Sie Ihre Postleitzahl ein.",
} as const;

export const guestCheckoutFieldMessages = {
  acceptedDataProtection: "Bitte stimmen Sie der Verarbeitung Ihrer Daten zu.",
  email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
} as const;

const checkoutMethodSelectionSchema = z.object({
  customerComment: optionalString(1000),
  paymentMethodId: requiredString(64),
  shippingMethodId: requiredString(64),
});

const checkoutOrderConfirmationSchema = z.object({
  acceptedTerms: z.literal(true),
});

const checkoutEmailUpdateSchema = z
  .object({
    email: emailSchema,
    emailConfirmation: z.string().trim(),
    password: z.string().max(4096),
  })
  .refine(({ email, emailConfirmation }) => email === emailConfirmation, {
    path: ["emailConfirmation"],
  });

const guestPasswordSchema = z.string().min(8).max(4096);

const checkoutMethodFieldMessages = {
  paymentMethodId: "Bitte wählen Sie eine Zahlungsart aus.",
  shippingMethodId: "Bitte wählen Sie eine Versandart aus.",
} as const;

const checkoutOrderConfirmationFieldMessages = {
  acceptedTerms: "Bitte stimmen Sie den Bedingungen zu.",
} as const;

const checkoutEmailUpdateFieldMessages = {
  email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  emailConfirmation: "Die E-Mail-Adressen stimmen nicht überein.",
  password: "Bitte geben Sie Ihr aktuelles Passwort ein.",
} as const;

const guestPasswordFieldMessages = {
  password: "Das Passwort muss mindestens acht Zeichen lang sein.",
} as const;

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
    billingAddress: getAddressInput(formData, "billingAddress."),
    email: formData.get("email"),
    shippingAddress: shippingSameAsBilling
      ? undefined
      : getAddressInput(formData, "shippingAddress."),
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
      const name = `${address}.${field}`;

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

function getFieldErrors(
  error: ZodError,
  messages: Readonly<Record<string, string>>,
) {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === "string" && field in messages) {
      fieldErrors[field] ??= messages[field];
    }
  }

  return fieldErrors satisfies NonNullable<CheckoutActionState["fieldErrors"]>;
}

export function validateCheckoutAddress(formData: FormData, prefix = "") {
  return checkoutAddressSchema.safeParse(getAddressInput(formData, prefix));
}

export function getCheckoutAddressFieldErrors(error: ZodError) {
  return getFieldErrors(error, checkoutAddressFieldMessages);
}

export function validateCheckoutMethodSelection(formData: FormData) {
  return checkoutMethodSelectionSchema.safeParse({
    customerComment: formData.get("customerComment"),
    paymentMethodId: formData.get("paymentMethodId"),
    shippingMethodId: formData.get("shippingMethodId"),
  });
}

export function validateCheckoutEmailUpdate(formData: FormData) {
  return checkoutEmailUpdateSchema.safeParse({
    email: formData.get("email"),
    emailConfirmation: formData.get("emailConfirmation"),
    password: formData.get("password") ?? "",
  });
}

export function getCheckoutEmailUpdateFieldErrors(error: ZodError) {
  return getFieldErrors(error, checkoutEmailUpdateFieldMessages);
}

export function getCheckoutMethodSelectionFieldErrors(error: ZodError) {
  return getFieldErrors(error, checkoutMethodFieldMessages);
}

export function validateCheckoutOrderConfirmation(formData: FormData) {
  return checkoutOrderConfirmationSchema.safeParse({
    acceptedTerms: formData.get("acceptedTerms") === "on",
  });
}

export function getCheckoutOrderConfirmationFieldErrors(error: ZodError) {
  return getFieldErrors(error, checkoutOrderConfirmationFieldMessages);
}

export function validateGuestPassword(formData: FormData) {
  return guestPasswordSchema.safeParse(formData.get("password"));
}

export function getGuestPasswordFieldErrors(_error: ZodError) {
  return {
    password: guestPasswordFieldMessages.password,
  } satisfies NonNullable<CheckoutActionState["fieldErrors"]>;
}

export function parseCheckoutAddress(
  formData: FormData,
  prefix = "",
): CheckoutAddress | null {
  const result = validateCheckoutAddress(formData, prefix);

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
  const result = validateCheckoutMethodSelection(formData);

  return result.success ? result.data : null;
}

export function parseGuestPassword(formData: FormData) {
  const result = validateGuestPassword(formData);

  return result.success ? result.data : null;
}
