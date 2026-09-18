import type {
  CheckoutAddress,
  CheckoutMethodSelection,
  GuestCheckoutRegistration,
} from "@/features/checkout/model/checkout";

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

function getOptionalValue(formData: FormData, name: string, maxLength: number) {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return undefined;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length <= maxLength
    ? normalizedValue || undefined
    : undefined;
}

export function parseCheckoutAddress(
  formData: FormData,
  prefix = "",
): CheckoutAddress | null {
  const additionalAddressLine1 = getOptionalValue(
    formData,
    `${prefix}additionalAddressLine1`,
    255,
  );
  const city = getValue(formData, `${prefix}city`, 255);
  const countryId = getValue(formData, `${prefix}countryId`, 64);
  const firstName = getValue(formData, `${prefix}firstName`, 255);
  const lastName = getValue(formData, `${prefix}lastName`, 255);
  const phoneNumber = getOptionalValue(formData, `${prefix}phoneNumber`, 40);
  const street = getValue(formData, `${prefix}street`, 255);
  const zipcode = getValue(formData, `${prefix}zipcode`, 50);

  if (!city || !countryId || !firstName || !lastName || !street || !zipcode) {
    return null;
  }

  return {
    additionalAddressLine1,
    city,
    countryId,
    firstName,
    lastName,
    phoneNumber,
    street,
    zipcode,
  };
}

export function parseGuestCheckoutRegistration(
  formData: FormData,
): GuestCheckoutRegistration | null {
  const acceptedDataProtection =
    formData.get("acceptedDataProtection") === "on";
  const billingAddress = parseCheckoutAddress(formData);
  const email = getValue(formData, "email", 254);
  const shippingSameAsBilling = formData.get("shippingSameAsBilling") === "on";
  const shippingAddress = shippingSameAsBilling
    ? undefined
    : parseCheckoutAddress(formData, "shipping");

  if (
    !acceptedDataProtection ||
    !billingAddress ||
    !email ||
    !emailPattern.test(email) ||
    (!shippingSameAsBilling && !shippingAddress)
  ) {
    return null;
  }

  return {
    acceptedDataProtection: true,
    billingAddress,
    email,
    shippingAddress: shippingAddress || undefined,
  };
}

export function parseCheckoutMethodSelection(
  formData: FormData,
): CheckoutMethodSelection | null {
  const acceptedTerms = formData.get("acceptedTerms") === "on";
  const customerComment = getOptionalValue(formData, "customerComment", 1000);
  const paymentMethodId = getValue(formData, "paymentMethodId", 64);
  const shippingMethodId = getValue(formData, "shippingMethodId", 64);

  if (!acceptedTerms || !paymentMethodId || !shippingMethodId) {
    return null;
  }

  return {
    acceptedTerms: true,
    customerComment,
    paymentMethodId,
    shippingMethodId,
  };
}

export function parseGuestPassword(formData: FormData) {
  const value = formData.get("password");

  return typeof value === "string" && value.length >= 8 && value.length <= 4096
    ? value
    : null;
}
