import { describe, expect, test } from "bun:test";

import {
  createShopwareCheckoutDeliveryAddress,
  getShopwareCheckoutCustomer,
} from "@/integrations/shopware/checkout";
import type { ShopwareClient } from "@/integrations/shopware/client";

function createClient(customer: unknown) {
  return {
    invoke: async () => ({ data: { customer } }),
  } as unknown as ShopwareClient;
}

describe("getShopwareCheckoutCustomer", () => {
  test("uses the active shipping address for checkout delivery", async () => {
    const customer = await getShopwareCheckoutCustomer(
      createClient({
        activeShippingAddress: {
          city: "DÃ¼sseldorf",
          country: { name: "Deutschland", translated: { name: "Deutschland" } },
          countryId: "country-id",
          firstName: "Greta",
          lastName: "GroÃŸ",
          street: "Rheinufer 8",
          zipcode: "40213",
        },
        defaultBillingAddress: {
          city: "KÃ¶ln",
          countryId: "country-id",
          firstName: "Greta",
          lastName: "GroÃŸ",
          street: "DomstraÃŸe 1",
          zipcode: "50667",
        },
        email: "greta@example.com",
        firstName: "Greta",
        lastName: "GroÃŸ",
      }),
    );

    expect(customer).toMatchObject({
      addressComplete: true,
      billingAddress: { street: "DomstraÃŸe 1" },
      shippingAddress: {
        city: "DÃ¼sseldorf",
        country: "Deutschland",
        street: "Rheinufer 8",
      },
    });
  });
});

describe("createShopwareCheckoutDeliveryAddress", () => {
  test("creates an address and uses it as the default shipping address", async () => {
    const operations: string[] = [];
    const client = {
      invoke: async (operation: string) => {
        operations.push(operation);

        if (operation === "readContext get /context") {
          return {
            data: {
              customer: {
                defaultBillingAddress: {
                  id: "billing-address-id",
                  salutationId: "salutation-id",
                },
                guest: false,
              },
            },
          };
        }

        return { data: { id: "delivery-address-id" } };
      },
    } as unknown as ShopwareClient;

    await createShopwareCheckoutDeliveryAddress(client, {
      city: "KÃ¶ln",
      countryId: "country-id",
      firstName: "Greta",
      lastName: "GroÃŸ",
      street: "DomstraÃŸe 1",
      zipcode: "50667",
    });

    expect(operations).toEqual([
      "readContext get /context",
      "createCustomerAddress post /account/address",
      "defaultShippingAddress patch /account/address/default-shipping/{addressId}",
    ]);
  });
});
