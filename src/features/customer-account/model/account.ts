export type CustomerAddressSummary = Readonly<{
  city: string;
  country?: string;
  countryId: string;
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

export type CustomerOrderSummary = Readonly<{
  currency: string;
  date: string;
  number: string;
  status: string;
  total: number;
}>;

export type CustomerOrderDetail = CustomerOrderSummary &
  Readonly<{
    items: readonly Readonly<{
      label: string;
      quantity: number;
      total: number;
    }>[];
  }>;

export type RegistrationOption = Readonly<{
  id: string;
  label: string;
}>;

export type RegistrationOptions = Readonly<{
  defaultCountryId: string;
  salutations: RegistrationOption[];
}>;

export type AccountActionState = Readonly<{
  message?: string;
  status: "idle" | "invalid" | "error" | "success";
}>;

export type CustomerLogin = Readonly<{
  email: string;
  password: string;
  rememberMe: boolean;
}>;

export type CustomerRegistration = Readonly<{
  acceptedDataProtection: true;
  accountType: "business" | "private";
  company?: string;
  countryId: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  salutationId?: string;
  vatId?: string;
}>;
