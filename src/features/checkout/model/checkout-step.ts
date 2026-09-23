import type {
  CheckoutMethodSelection,
  CheckoutOptions,
} from "@/features/checkout/model/checkout";

export type CheckoutStep = "address" | "payment" | "review";

type CheckoutStepInput = Readonly<{
  addressComplete: boolean;
  options: Pick<CheckoutOptions, "paymentMethods" | "shippingMethods">;
  requestedStep?: CheckoutStep;
  selection: CheckoutMethodSelection | null;
}>;

export function hasAvailableCheckoutSelection(
  selection: CheckoutMethodSelection | null,
  options: CheckoutStepInput["options"],
) {
  return Boolean(
    selection &&
    options.paymentMethods.some(
      (method) => method.id === selection.paymentMethodId,
    ) &&
    options.shippingMethods.some(
      (method) => method.id === selection.shippingMethodId,
    ),
  );
}

export function resolveCheckoutStep({
  addressComplete,
  options,
  requestedStep,
  selection,
}: CheckoutStepInput): CheckoutStep {
  if (!addressComplete || requestedStep === "address") {
    return "address";
  }

  if (
    requestedStep === "payment" ||
    !hasAvailableCheckoutSelection(selection, options)
  ) {
    return "payment";
  }

  return "review";
}
