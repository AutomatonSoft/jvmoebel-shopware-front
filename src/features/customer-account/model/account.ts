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
    delivery?: string;
    items: readonly Readonly<{
      label: string;
      quantity: number;
      total: number;
    }>[];
    payment?: string;
    shippingAddress?: Readonly<{
      city: string;
      firstName: string;
      lastName: string;
      street: string;
      zipcode?: string;
    }>;
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
  fieldErrors?: Readonly<Partial<Record<string, string>>>;
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
  newsletterConsent: boolean;
  password: string;
  salutationId?: string;
  vatId?: string;
}>;

export type CustomerProfileUpdate = Readonly<{
  firstName: string;
  lastName: string;
}>;

export type CustomerEmailChange = Readonly<{
  email: string;
  emailConfirmation: string;
  password: string;
}>;

export type CustomerSettingsUpdate = CustomerProfileUpdate &
  Readonly<{
    currentEmail: string;
    email: string;
  }>;
