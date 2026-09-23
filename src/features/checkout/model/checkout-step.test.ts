import { describe, expect, test } from "bun:test";

import type {
  CheckoutMethodSelection,
  CheckoutOptions,
} from "@/features/checkout/model/checkout";
import { resolveCheckoutStep } from "@/features/checkout/model/checkout-step";

const options: Pick<CheckoutOptions, "paymentMethods" | "shippingMethods"> = {
  paymentMethods: [{ id: "payment-card", label: "Kreditkarte" }],
  shippingMethods: [{ id: "shipping-standard", label: "Standardversand" }],
};

const selection: CheckoutMethodSelection = {
  paymentMethodId: "payment-card",
  shippingMethodId: "shipping-standard",
};

describe("resolveCheckoutStep", () => {
  test("starts with the address when the customer address is incomplete", () => {
    expect(
      resolveCheckoutStep({
        addressComplete: false,
        options,
        selection,
      }),
    ).toBe("address");
  });

  test("continues with payment when no selection was saved", () => {
    expect(
      resolveCheckoutStep({
        addressComplete: true,
        options,
        selection: null,
      }),
    ).toBe("payment");
  });

  test("continues with payment when a saved method is unavailable", () => {
    expect(
      resolveCheckoutStep({
        addressComplete: true,
        options,
        selection: { ...selection, paymentMethodId: "payment-unavailable" },
      }),
    ).toBe("payment");
  });

  test("opens the review when all saved checkout data is valid", () => {
    expect(
      resolveCheckoutStep({
        addressComplete: true,
        options,
        selection,
      }),
    ).toBe("review");
  });

  test("allows reopening a completed address step", () => {
    expect(
      resolveCheckoutStep({
        addressComplete: true,
        options,
        requestedStep: "address",
        selection,
      }),
    ).toBe("address");
  });

  test("allows reopening a completed payment step", () => {
    expect(
      resolveCheckoutStep({
        addressComplete: true,
        options,
        requestedStep: "payment",
        selection,
      }),
    ).toBe("payment");
  });

  test("does not allow review when required data is missing", () => {
    expect(
      resolveCheckoutStep({
        addressComplete: true,
        options,
        requestedStep: "review",
        selection: null,
      }),
    ).toBe("payment");
  });
});
