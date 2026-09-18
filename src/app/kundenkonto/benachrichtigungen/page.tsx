import type { Metadata } from "next";
import { BellRing, Gift, Mail } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Container } from "@/components/ui/container";
import { getCustomerAccount } from "@/features/customer-account/server/account";

export const metadata: Metadata = { title: "Benachrichtigungen | JVMöbel" };

export default async function CustomerNotificationsRoute() {
  const account = await getCustomerAccount();

  if (!account) redirect("/kundenkonto/anmelden");

  return (
    <main className="flex-1">
      <Container className="max-w-3xl py-10 sm:py-14">
        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          Mein JVMöbel
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
          Benachrichtigungen
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Wir informieren Sie über wichtige Änderungen zu Ihrem Konto und Ihren
          Bestellungen.
        </p>
        <div className="mt-8 grid gap-4">
          <section className="rounded-3xl border border-border bg-card p-6">
            <Mail aria-hidden="true" className="size-5 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">Bestellinformationen</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Bestellbestätigungen, Lieferupdates und wichtige
              Kontoinformationen senden wir an {account.email}.
            </p>
          </section>
          <section className="rounded-3xl bg-secondary p-6">
            <Gift aria-hidden="true" className="size-5 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">
              Angebote & Inspiration
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Entdecken Sie aktuelle Aktionen und neue Einrichtungsideen.
            </p>
            <Link
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              href="/rabatt-angebote"
            >
              Zu den Angeboten{" "}
              <BellRing aria-hidden="true" className="size-4" />
            </Link>
          </section>
        </div>
      </Container>
    </main>
  );
}
