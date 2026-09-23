import "server-only";

import { cookies } from "next/headers";

import type { CheckoutMethodSelection } from "@/features/checkout/model/checkout";

const checkoutMethodSelectionCookie = "jv-checkout-method-selection";

function parseMethodSelection(value?: string): CheckoutMethodSelection | null {
  if (!value) {
    return null;
  }

  try {
    const selection = JSON.parse(value) as Partial<CheckoutMethodSelection>;

    return typeof selection.paymentMethodId === "string" &&
      typeof selection.shippingMethodId === "string"
      ? {
          customerComment:
            typeof selection.customerComment === "string"
              ? selection.customerComment
              : undefined,
          paymentMethodId: selection.paymentMethodId,
          shippingMethodId: selection.shippingMethodId,
        }
      : null;
  } catch {
    return null;
  }
}

export async function getCheckoutMethodSelection() {
  const cookieStore = await cookies();

  return parseMethodSelection(
    cookieStore.get(checkoutMethodSelectionCookie)?.value,
  );
}

export async function persistCheckoutMethodSelection(
  selection: CheckoutMethodSelection,
) {
  const cookieStore = await cookies();

  cookieStore.set(checkoutMethodSelectionCookie, JSON.stringify(selection), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearCheckoutMethodSelection() {
  const cookieStore = await cookies();

  cookieStore.delete(checkoutMethodSelectionCookie);
}
