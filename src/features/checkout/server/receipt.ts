import "server-only";

import { cookies } from "next/headers";

import type { CheckoutReceipt } from "@/features/checkout/model/checkout";

const checkoutReceiptCookie = "jv-checkout-receipt";

function parseReceipt(value?: string): CheckoutReceipt | null {
  if (!value) {
    return null;
  }

  try {
    const receipt = JSON.parse(value) as Partial<CheckoutReceipt>;

    return typeof receipt.currency === "string" &&
      typeof receipt.guest === "boolean" &&
      typeof receipt.orderNumber === "string" &&
      typeof receipt.total === "number"
      ? (receipt as CheckoutReceipt)
      : null;
  } catch {
    return null;
  }
}

export async function persistCheckoutReceipt(receipt: CheckoutReceipt) {
  const cookieStore = await cookies();

  cookieStore.set(checkoutReceiptCookie, JSON.stringify(receipt), {
    httpOnly: true,
    maxAge: 60 * 60,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getCheckoutReceipt() {
  const cookieStore = await cookies();

  return parseReceipt(cookieStore.get(checkoutReceiptCookie)?.value);
}
