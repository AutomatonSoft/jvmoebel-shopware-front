import { describe, expect, test } from "bun:test";

import {
  createShopwareCheckoutBillingAddress,
  createShopwareCheckoutDeliveryAddress,
  getShopwareCheckoutCustomer,
  selectShopwareCheckoutDeliveryAddress,
  updateShopwareCheckoutDeliveryAddress,
  updateShopwareCustomerAddress,
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
          id: "shipping-address-id",
          city: "Düsseldorf",
          country: { name: "Deutschland", translated: { name: "Deutschland" } },
          countryId: "country-id",
          firstName: "Greta",
          lastName: "Groß",
          street: "Rheinufer 8",
          zipcode: "40213",
        },
        defaultBillingAddress: {
          city: "Köln",
          countryId: "country-id",
          firstName: "Greta",
          lastName: "Groß",
          street: "Domstraße 1",
          zipcode: "50667",
        },
        email: "greta@example.com",
        firstName: "Greta",
        lastName: "Groß",
      }),
    );

    expect(customer).toMatchObject({
      activeShippingAddressId: "shipping-address-id",
      addressComplete: true,
      billingAddress: { street: "Domstraße 1" },
      shippingAddress: {
        city: "Düsseldorf",
        country: "Deutschland",
        street: "Rheinufer 8",
      },
    });
  });

  test("shows the billing address selected for the current checkout", async () => {
    const customer = await getShopwareCheckoutCustomer(
      createClient({
        activeBillingAddress: {
          city: "Berlin",
          countryId: "country-id",
          firstName: "Greta",
          lastName: "Groß",
          street: "Neue Straße 2",
          zipcode: "10115",
        },
        defaultBillingAddress: {
          city: "Köln",
          countryId: "country-id",
          firstName: "Greta",
          lastName: "Groß",
          street: "Domstraße 1",
          zipcode: "50667",
        },
        email: "greta@example.com",
        firstName: "Greta",
        lastName: "Groß",
      }),
    );

    expect(customer?.billingAddress?.street).toBe("Neue Straße 2");
  });
});

describe("createShopwareCheckoutBillingAddress", () => {
  test("creates an address and selects it for the current checkout", async () => {
    const operations: string[] = [];
    const client = {
      invoke: async (operation: string, parameters: unknown) => {
        operations.push(operation);
        if (operation === "readContext get /context") {
          return {
            data: {
              customer: {
                defaultBillingAddress: { salutationId: "salutation-id" },
                guest: false,
              },
            },
          };
        }
        if (operation === "updateContext patch /context") {
          expect(parameters).toMatchObject({
            body: { billingAddressId: "new-billing-address-id" },
          });
        }
        return { data: { id: "new-billing-address-id" } };
      },
    } as unknown as ShopwareClient;

    await createShopwareCheckoutBillingAddress(client, {
      city: "Berlin",
      countryId: "country-id",
      firstName: "Greta",
      lastName: "Groß",
      street: "Neue Straße 2",
      zipcode: "10115",
    });

    expect(operations).toEqual([
      "readContext get /context",
      "createCustomerAddress post /account/address",
      "updateContext patch /context",
    ]);
  });
});

describe("updateShopwareCustomerAddress", () => {
  test("updates only the billing address when delivery uses another address", async () => {
    const updatedAddressIds: string[] = [];
    const client = {
      invoke: async (operation: string, parameters: unknown) => {
        if (operation === "readContext get /context") {
          return {
            data: {
              customer: {
                activeShippingAddress: { id: "shipping-address-id" },
                defaultBillingAddress: {
                  id: "billing-address-id",
                  salutationId: "salutation-id",
                },
              },
            },
          };
        }

        updatedAddressIds.push(
          (parameters as { pathParams: { addressId: string } }).pathParams
            .addressId,
        );
        return { data: {} };
      },
    } as unknown as ShopwareClient;

    await updateShopwareCustomerAddress(client, {
      city: "Köln",
      countryId: "country-id",
      firstName: "Greta",
      lastName: "Groß",
      street: "Domstraße 1",
      zipcode: "50667",
    });

    expect(updatedAddressIds).toEqual(["billing-address-id"]);
  });
});

describe("updateShopwareCheckoutDeliveryAddress", () => {
  test("updates the active delivery address", async () => {
    const updatedAddressIds: string[] = [];
    const client = {
      invoke: async (operation: string, parameters: unknown) => {
        if (operation === "readContext get /context") {
          return {
            data: {
              customer: {
                activeShippingAddress: {
                  id: "shipping-address-id",
                  salutationId: "salutation-id",
                },
                defaultBillingAddress: { id: "billing-address-id" },
              },
            },
          };
        }

        updatedAddressIds.push(
          (parameters as { pathParams: { addressId: string } }).pathParams
            .addressId,
        );
        return { data: {} };
      },
    } as unknown as ShopwareClient;

    await updateShopwareCheckoutDeliveryAddress(client, {
      city: "Düsseldorf",
      countryId: "country-id",
      firstName: "Greta",
      lastName: "Groß",
      street: "Rheinufer 8",
      zipcode: "40213",
    });

    expect(updatedAddressIds).toEqual(["shipping-address-id"]);
  });
});

describe("createShopwareCheckoutDeliveryAddress", () => {
  test("creates an address and selects it for the current checkout", async () => {
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
      city: "Köln",
      countryId: "country-id",
      firstName: "Greta",
      lastName: "Groß",
      street: "Domstraße 1",
      zipcode: "50667",
    });

    expect(operations).toEqual([
      "readContext get /context",
      "createCustomerAddress post /account/address",
      "updateContext patch /context",
    ]);
  });
});

describe("selectShopwareCheckoutDeliveryAddress", () => {
  test("sets a saved address in the checkout context without changing defaults", async () => {
    const operations: string[] = [];
    const client = {
      invoke: async (operation: string) => {
        operations.push(operation);

        if (operation === "readContext get /context") {
          return {
            data: {
              customer: {
                addresses: [{ id: "delivery-address-id" }],
                guest: false,
              },
            },
          };
        }

        return { data: {} };
      },
    } as unknown as ShopwareClient;

    await selectShopwareCheckoutDeliveryAddress(client, "delivery-address-id");

    expect(operations).toEqual([
      "readContext get /context",
      "updateContext patch /context",
    ]);
  });
});
