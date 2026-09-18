import type { components } from "@shopware/api-client/store-api-types";

type ShopwareCustomerAddress = components["schemas"]["CustomerAddress"];

export const pendingCustomerAddressValues = {
  city: "Noch nicht angegeben",
  street: "Noch nicht angegeben",
  zipcode: "00000",
} as const;

export function isPendingCustomerAddress(
  address: ShopwareCustomerAddress | null | undefined,
) {
  return (
    address?.city === pendingCustomerAddressValues.city &&
    address.street === pendingCustomerAddressValues.street &&
    address.zipcode === pendingCustomerAddressValues.zipcode
  );
}
