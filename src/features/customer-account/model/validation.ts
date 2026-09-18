import type {
  CustomerLogin,
  CustomerRegistration,
} from "@/features/customer-account/model/account";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getValue(formData: FormData, name: string, maxLength: number) {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return undefined;
  }

  const normalizedValue = value.trim();

  return normalizedValue && normalizedValue.length <= maxLength
    ? normalizedValue
    : undefined;
}

function getEmail(formData: FormData) {
  const email = getValue(formData, "email", 254);

  return email && emailPattern.test(email) ? email : undefined;
}

function getPassword(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" && value.length <= 4096 ? value : undefined;
}

export function parseCustomerLogin(formData: FormData): CustomerLogin | null {
  const email = getEmail(formData);
  const password = getPassword(formData, "password");

  return email && password
    ? {
        email,
        password,
        rememberMe: formData.get("rememberMe") === "on",
      }
    : null;
}

export function parseCustomerRegistration(
  formData: FormData,
): CustomerRegistration | null {
  const acceptedDataProtection =
    formData.get("acceptedDataProtection") === "on";
  const accountType = formData.get("accountType");
  const company = getValue(formData, "company", 255);
  const countryId = getValue(formData, "countryId", 64);
  const email = getEmail(formData);
  const firstName = getValue(formData, "firstName", 255);
  const lastName = getValue(formData, "lastName", 255);
  const password = getPassword(formData, "password");
  const salutationId = getValue(formData, "salutationId", 64);
  const vatId = getValue(formData, "vatId", 50);

  if (
    !acceptedDataProtection ||
    (accountType !== "private" && accountType !== "business") ||
    (accountType === "business" && (!company || !vatId)) ||
    !countryId ||
    !email ||
    !firstName ||
    !lastName ||
    !password ||
    password.length < 8 ||
    password.length > 72
  ) {
    return null;
  }

  return {
    acceptedDataProtection: true,
    accountType,
    company: accountType === "business" ? company : undefined,
    countryId,
    email,
    firstName,
    lastName,
    password,
    salutationId,
    vatId: accountType === "business" ? vatId : undefined,
  };
}
