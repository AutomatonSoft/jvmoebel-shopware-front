import { describe, expect, test } from "bun:test";
import type { components } from "@shopware/api-client/store-api-types";

import { mapShopwareCustomerAccount } from "@/integrations/shopware/mappers/customer-account";

type ShopwareCustomer = components["schemas"]["Customer"];

describe("mapShopwareCustomerAccount", () => {
  test("maps profile details and the default billing address", () => {
    const customer = {
      activeBillingAddress: {
        city: "Köln",
        firstName: "Greta",
        lastName: "Groß",
        street: "Alte Straße 8",
        zipcode: "50667",
      },
      customerNumber: "10042",
      defaultBillingAddress: {
        city: "Düsseldorf",
        country: {
          name: "Deutschland",
          translated: { name: "Deutschland" },
        },
        firstName: "Greta",
        lastName: "Groß",
        street: "Neue Straße 12",
        zipcode: "40210",
      },
      email: "greta@example.com",
      firstName: "Greta",
      lastName: "Groß",
    } as ShopwareCustomer;

    expect(mapShopwareCustomerAccount(customer)).toEqual({
      billingAddress: {
        city: "Düsseldorf",
        country: "Deutschland",
        firstName: "Greta",
        lastName: "Groß",
        street: "Neue Straße 12",
        zipcode: "40210",
      },
      customerNumber: "10042",
      email: "greta@example.com",
      firstName: "Greta",
      lastName: "Groß",
    });
  });

  test("returns null when there is no authenticated customer", () => {
    expect(mapShopwareCustomerAccount(undefined)).toBeNull();
  });
});
