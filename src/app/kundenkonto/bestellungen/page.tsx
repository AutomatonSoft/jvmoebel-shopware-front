import type { Metadata } from "next";
import { PackageCheck } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import {
  getCustomerAccount,
  getCustomerAccountOrderHistory,
} from "@/features/customer-account/server/account";

export const metadata: Metadata = { title: "Meine Bestellungen | JVMöbel" };

export default async function CustomerOrdersRoute() {
  const [account, orders] = await Promise.all([
    getCustomerAccount(),
    getCustomerAccountOrderHistory(),
  ]);

  if (!account) redirect("/kundenkonto/anmelden");

  return (
    <main className="flex-1">
      <Container className="max-w-4xl py-10 sm:py-14">
        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          Mein JVMöbel
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
          Meine Bestellungen
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Hier finden Sie alle Bestellungen, die Sie mit diesem Kundenkonto
          aufgegeben haben.
        </p>
        <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <PackageCheck
                aria-hidden="true"
                className="mx-auto size-8 text-primary"
              />
              <p className="mt-4 font-semibold">Noch keine Bestellungen</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Sobald Sie bestellen, erscheint Ihre Bestellung hier.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <Link
                className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-5 last:border-b-0"
                href={`/kundenkonto/bestellungen/${encodeURIComponent(order.number)}`}
                key={order.number}
              >
                <PackageCheck
                  aria-hidden="true"
                  className="size-5 text-primary"
                />
                <div className="min-w-40 flex-1">
                  <p className="text-sm font-semibold">
                    Bestellung {order.number}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("de-DE", {
                      dateStyle: "medium",
                    }).format(new Date(order.date))}
                  </p>
                </div>
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold">
                  {order.status}
                </span>
                <p className="ml-auto text-sm font-semibold">
                  {new Intl.NumberFormat("de-DE", {
                    currency: order.currency,
                    style: "currency",
                  }).format(order.total)}
                </p>
              </Link>
            ))
          )}
        </section>
      </Container>
    </main>
  );
}
