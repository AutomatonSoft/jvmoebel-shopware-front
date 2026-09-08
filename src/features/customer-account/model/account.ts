export type CustomerAccountSummary = Readonly<{
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
