import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { OrderConfirmation } from "@/features/checkout/components/order-confirmation";
import { getCheckoutReceipt } from "@/features/checkout/server/receipt";

export const metadata: Metadata = {
  description: "Ihre Bestellung bei JVMöbel wurde erfolgreich übermittelt.",
  robots: { follow: false, index: false },
  title: "Bestellung bestätigt | JVMöbel",
};

type OrderConfirmationRouteProps = Readonly<{
  searchParams: Promise<{
    konto?: string | string[];
    zahlung?: string | string[];
  }>;
}>;

export default async function OrderConfirmationRoute({
  searchParams,
}: OrderConfirmationRouteProps) {
  const [receipt, parameters] = await Promise.all([
    getCheckoutReceipt(),
    searchParams,
  ]);

  if (!receipt) {
    redirect("/");
  }

  const account = Array.isArray(parameters.konto)
    ? parameters.konto[0]
    : parameters.konto;
  const payment = Array.isArray(parameters.zahlung)
    ? parameters.zahlung[0]
    : parameters.zahlung;

  return (
    <OrderConfirmation
      accountCreated={account === "erstellt"}
      paymentPending={payment === "offen"}
      receipt={receipt}
    />
  );
}
