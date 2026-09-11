import type { components } from "@shopware/api-client/store-api-types";

import type { CustomerAccountSummary } from "@/features/customer-account/model/account";

type ShopwareCustomer = components["schemas"]["Customer"];

export function mapShopwareCustomerAccount(
  customer: ShopwareCustomer | null | undefined,
): CustomerAccountSummary | null {
  if (!customer) {
    return null;
  }

  const address =
    customer.defaultBillingAddress ?? customer.activeBillingAddress;

  return {
    billingAddress: address
      ? {
          city: address.city,
          country:
            address.country?.translated.name ||
            address.country?.name ||
            undefined,
          firstName: address.firstName,
          lastName: address.lastName,
          street: address.street,
          zipcode: address.zipcode || undefined,
        }
      : undefined,
    customerNumber: customer.customerNumber,
    email: customer.email,
    firstName: customer.firstName,
    lastName: customer.lastName,
  };
}
