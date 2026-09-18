import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Container } from "@/components/ui/container";
import {
  getCustomerAccount,
  getCustomerOrderDetail,
} from "@/features/customer-account/server/account";

export const metadata: Metadata = { title: "Bestellung | JVMöbel" };

export default async function CustomerOrderDetailRoute({
  params,
}: PageProps<"/kundenkonto/bestellungen/[number]">) {
  const { number } = await params;
  const [account, order] = await Promise.all([
    getCustomerAccount(),
    getCustomerOrderDetail(number),
  ]);
  if (!account) redirect("/kundenkonto/anmelden");
  if (!order) notFound();
  const money = new Intl.NumberFormat("de-DE", {
    currency: order.currency,
    style: "currency",
  });
  return (
    <main className="flex-1">
      <Container className="max-w-3xl py-10 sm:py-14">
        <Link
          className="text-sm font-semibold text-primary hover:underline"
          href="/kundenkonto/bestellungen"
        >
          ← Alle Bestellungen
        </Link>
        <p className="mt-8 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          Bestellung
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
          {order.number}
        </h1>
        <div className="mt-6 flex items-center gap-3">
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold">
            {order.status}
          </span>
          <span className="text-sm text-muted-foreground">
            {new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(
              new Date(order.date),
            )}
          </span>
        </div>
        <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
          {order.items.map((item, index) => (
            <div
              className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-b-0"
              key={`${item.label}-${index}`}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Menge: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {money.format(item.total)}
              </p>
            </div>
          ))}
          <div className="flex items-center justify-between bg-secondary px-5 py-5">
            <p className="font-semibold">Gesamtsumme</p>
            <p className="text-lg font-semibold">{money.format(order.total)}</p>
          </div>
        </section>
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Lieferung</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {order.delivery ?? "Versandart wird vorbereitet"}
            </p>
            {order.shippingAddress && (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
                <br />
                {order.shippingAddress.street}
                <br />
                {order.shippingAddress.zipcode} {order.shippingAddress.city}
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Zahlung</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {order.payment ?? "Zahlungsart wird vorbereitet"}
            </p>
          </div>
        </section>
      </Container>
    </main>
  );
}
