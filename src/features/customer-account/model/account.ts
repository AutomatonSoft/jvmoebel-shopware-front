export type CustomerAddressSummary = Readonly<{
  city: string;
  country?: string;
  firstName: string;
  lastName: string;
  street: string;
  zipcode?: string;
}>;

export type CustomerAccountSummary = Readonly<{
  billingAddress?: CustomerAddressSummary;
  customerNumber: string;
  email: string;
  firstName: string;
  lastName: string;
}>;

export type RegistrationOption = Readonly<{
  id: string;
  label: string;
}>;

export type RegistrationOptions = Readonly<{
  countries: RegistrationOption[];
}>;

export type AccountActionState = Readonly<{
  message?: string;
  status: "idle" | "invalid" | "error";
}>;

export type CustomerLogin = Readonly<{
  email: string;
  password: string;
}>;

export type CustomerRegistration = Readonly<{
  acceptedDataProtection: true;
  city: string;
  countryId: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  street: string;
  zipcode: string;
}>;
