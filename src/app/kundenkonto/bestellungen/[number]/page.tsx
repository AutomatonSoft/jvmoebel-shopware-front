import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Container } from "@/components/ui/container";
import {
  getCustomerAccount,
  getCustomerOrderDetail,
} from "@/features/customer-account/server/account";

export const metadata: Metadata = { title: "Bestellung | JVMoebel" };

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
  const orderDate = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
  }).format(new Date(order.date));

  return (
    <main className="flex-1">
      <Container className="max-w-5xl py-6 sm:py-9">
        <Link
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-foreground"
          href="/kundenkonto/bestellungen"
        >
          <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
          Alle Bestellungen
        </Link>

        <header className="mt-5 border-b border-border pb-5 sm:flex sm:items-end sm:justify-between sm:gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Bestellung
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
              {order.number}
            </h1>
          </div>
          <span className="mt-4 inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold sm:mt-0">
            {order.status}
          </span>
        </header>

        <dl className="grid divide-y divide-border rounded-2xl border border-border bg-card sm:mt-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-5 py-3.5">
            <dt className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
              Bestelldatum
            </dt>
            <dd className="mt-1 text-sm font-semibold">{orderDate}</dd>
          </div>
          <div className="px-5 py-3.5">
            <dt className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
              Artikel
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {order.items.length}{" "}
              {order.items.length === 1 ? "Position" : "Positionen"}
            </dd>
          </div>
          <div className="px-5 py-3.5">
            <dt className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
              Gesamtsumme
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {money.format(order.total)}
            </dd>
          </div>
        </dl>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <header className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <h2 className="text-sm font-semibold">Artikel</h2>
              <span className="text-xs text-muted-foreground">
                Menge & Preis
              </span>
            </header>
            {order.items.map((item, index) => (
              <article
                className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-5 border-b border-border px-5 py-4 last:border-b-0"
                key={`${item.label}-${index}`}
              >
                <div>
                  <h3 className="text-sm font-semibold">{item.label}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Menge: {item.quantity}
                  </p>
                </div>
                <p className="self-center text-sm font-semibold">
                  {money.format(item.total)}
                </p>
              </article>
            ))}
            <div className="flex items-center justify-between bg-secondary px-5 py-4">
              <p className="text-sm font-semibold">Gesamtsumme</p>
              <p className="text-base font-semibold">
                {money.format(order.total)}
              </p>
            </div>
          </section>

          <aside className="overflow-hidden rounded-2xl border border-border bg-card">
            <h2 className="border-b border-border px-5 py-3.5 text-sm font-semibold">
              Bestellinformationen
            </h2>
            <section className="px-5 py-4">
              <h3 className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                Lieferung
              </h3>
              <p className="mt-1.5 text-sm font-medium">
                {order.delivery ?? "Versandart wird vorbereitet"}
              </p>
              {order.shippingAddress && (
                <address className="mt-3 text-sm leading-5 text-muted-foreground not-italic">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                  <br />
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.zipcode} {order.shippingAddress.city}
                </address>
              )}
            </section>
            <section className="border-t border-border px-5 py-4">
              <h3 className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                Zahlung
              </h3>
              <p className="mt-1.5 text-sm font-medium">
                {order.payment ?? "Zahlungsart wird vorbereitet"}
              </p>
            </section>
          </aside>
        </div>
      </Container>
    </main>
  );
}
