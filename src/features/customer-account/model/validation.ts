import { z, type ZodError } from "zod";

import type {
  AccountActionState,
  CustomerEmailChange,
  CustomerLogin,
  CustomerProfileUpdate,
  CustomerRegistration,
  CustomerSettingsUpdate,
} from "@/features/customer-account/model/account";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requiredString(maxLength: number) {
  return z.string().trim().min(1).max(maxLength);
}

function optionalString(maxLength: number) {
  return z
    .string()
    .trim()
    .min(1)
    .max(maxLength)
    .transform((value) => value || undefined)
    .catch(undefined);
}

const emailSchema = requiredString(254).regex(emailPattern);

const customerLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(4096),
  rememberMe: z.boolean(),
});

const customerProfileUpdateSchema = z.object({
  firstName: requiredString(255),
  lastName: requiredString(255),
});

const customerEmailChangeSchema = z
  .object({
    email: z.string().trim().regex(emailPattern),
    emailConfirmation: z.string().trim(),
    password: z.string().min(1).max(4096),
  })
  .refine(({ email, emailConfirmation }) => email === emailConfirmation);

const customerSettingsUpdateSchema = customerProfileUpdateSchema.extend({
  currentEmail: z.string(),
  email: z.string(),
});

const registrationBaseSchema = z.object({
  acceptedDataProtection: z.literal(true),
  countryId: requiredString(64),
  email: emailSchema,
  firstName: requiredString(255),
  lastName: requiredString(255),
  password: z.string().min(8).max(72),
  salutationId: optionalString(64),
});

const registrationInputSchema = z.discriminatedUnion("accountType", [
  registrationBaseSchema.extend({ accountType: z.literal("private") }),
  registrationBaseSchema.extend({
    accountType: z.literal("business"),
    company: requiredString(255),
    vatId: requiredString(50),
  }),
]);

const customerRegistrationSchema = registrationInputSchema.transform(
  (registration): CustomerRegistration => ({
    acceptedDataProtection: true,
    accountType: registration.accountType,
    company:
      registration.accountType === "business"
        ? registration.company
        : undefined,
    countryId: registration.countryId,
    email: registration.email,
    firstName: registration.firstName,
    lastName: registration.lastName,
    password: registration.password,
    salutationId: registration.salutationId,
    vatId:
      registration.accountType === "business" ? registration.vatId : undefined,
  }),
);

const registrationFieldMessages = {
  accountType: "Bitte wählen Sie eine Kontoart aus.",
  company: "Bitte geben Sie Ihren Firmennamen ein.",
  email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  firstName: "Bitte geben Sie Ihren Vornamen ein.",
  lastName: "Bitte geben Sie Ihren Nachnamen ein.",
  password: "Das Passwort muss zwischen 8 und 72 Zeichen lang sein.",
  vatId: "Bitte geben Sie Ihre Steuer- oder USt-IdNr. ein.",
} as const;

function getCustomerRegistrationInput(formData: FormData) {
  return {
    acceptedDataProtection: formData.get("acceptedDataProtection") === "on",
    accountType: formData.get("accountType"),
    company: formData.get("company"),
    countryId: formData.get("countryId"),
    email: formData.get("email"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    password: formData.get("password"),
    salutationId: formData.get("salutationId"),
    vatId: formData.get("vatId"),
  };
}

export function validateCustomerRegistration(formData: FormData) {
  return customerRegistrationSchema.safeParse(
    getCustomerRegistrationInput(formData),
  );
}

export function getCustomerRegistrationFieldErrors(error: ZodError) {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (
      typeof field === "string" &&
      field in registrationFieldMessages &&
      !fieldErrors[field]
    ) {
      fieldErrors[field] =
        registrationFieldMessages[
          field as keyof typeof registrationFieldMessages
        ];
    }
  }

  return fieldErrors satisfies NonNullable<AccountActionState["fieldErrors"]>;
}

export function parseCustomerLogin(formData: FormData): CustomerLogin | null {
  const result = customerLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "on",
  });

  return result.success ? result.data : null;
}

export function parseCustomerRegistration(
  formData: FormData,
): CustomerRegistration | null {
  const result = validateCustomerRegistration(formData);

  return result.success ? result.data : null;
}

export function parseCustomerProfileUpdate(
  formData: FormData,
): CustomerProfileUpdate | null {
  const result = customerProfileUpdateSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });

  return result.success ? result.data : null;
}

export function parseCustomerEmailChange(
  formData: FormData,
): CustomerEmailChange | null {
  const result = customerEmailChangeSchema.safeParse({
    email: formData.get("email"),
    emailConfirmation: formData.get("emailConfirmation"),
    password: formData.get("password"),
  });

  return result.success ? result.data : null;
}

export function parseCustomerSettingsUpdate(
  formData: FormData,
): CustomerSettingsUpdate | null {
  const result = customerSettingsUpdateSchema.safeParse({
    currentEmail: formData.get("currentEmail"),
    email: formData.get("email"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });

  return result.success ? result.data : null;
}
