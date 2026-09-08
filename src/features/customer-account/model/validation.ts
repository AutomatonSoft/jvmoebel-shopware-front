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

  return email && password ? { email, password } : null;
}

export function parseCustomerRegistration(
  formData: FormData,
): CustomerRegistration | null {
  const acceptedDataProtection =
    formData.get("acceptedDataProtection") === "on";
  const city = getValue(formData, "city", 255);
  const countryId = getValue(formData, "countryId", 64);
  const email = getEmail(formData);
  const firstName = getValue(formData, "firstName", 255);
  const lastName = getValue(formData, "lastName", 255);
  const password = getPassword(formData, "password");
  const street = getValue(formData, "street", 255);
  const zipcode = getValue(formData, "zipcode", 50);

  if (
    !acceptedDataProtection ||
    !city ||
    !countryId ||
    !email ||
    !firstName ||
    !lastName ||
    !password ||
    password.length < 8 ||
    !street ||
    !zipcode
  ) {
    return null;
  }

  return {
    acceptedDataProtection: true,
    city,
    countryId,
    email,
    firstName,
    lastName,
    password,
    street,
    zipcode,
  };
}
