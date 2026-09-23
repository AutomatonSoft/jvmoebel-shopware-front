import type { Metadata } from "next";
import { ArrowUpRight, Gift, MailCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Container } from "@/components/ui/container";
import { AccountBackButton } from "@/features/customer-account/components/account-back-button";
import { getCustomerAccount } from "@/features/customer-account/server/account";

export const metadata: Metadata = { title: "Benachrichtigungen | JVMoebel" };

export default async function CustomerNotificationsRoute() {
  const account = await getCustomerAccount();

  if (!account) redirect("/kundenkonto/anmelden");

  return (
    <main className="flex-1">
      <Container className="max-w-4xl py-7 sm:py-10">
        <AccountBackButton />
        <p className="mt-6 text-xs font-semibold tracking-[0.12em] text-primary uppercase">
          Kundenkonto
        </p>
        <h1 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
          Benachrichtigungen
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Wir informieren Sie über wichtige Änderungen zu Ihrem Konto und Ihren
          Bestellungen.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <section className="rounded-3xl border border-primary/15 bg-primary/[0.035] p-5 sm:p-6">
            <span className="grid size-10 place-items-center rounded-xl bg-card text-primary shadow-[0_12px_24px_-20px_rgba(21,21,19,0.7)]">
              <MailCheck
                aria-hidden="true"
                className="size-[1.125rem]"
                strokeWidth={1.6}
              />
            </span>
            <h2 className="mt-4 text-lg font-semibold">Bestellinformationen</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Bestellbestätigungen, Lieferupdates und wichtige
              Kontoinformationen senden wir an {account.email}.
            </p>
          </section>
          <section className="rounded-3xl border border-border/80 bg-card p-5 shadow-[0_20px_50px_-45px_rgba(21,21,19,0.7)] sm:p-6">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
              <Gift
                aria-hidden="true"
                className="size-[1.125rem]"
                strokeWidth={1.6}
              />
            </span>
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
              <ArrowUpRight
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.7}
              />
            </Link>
          </section>
        </div>
        <section className="mt-6 flex gap-3 rounded-2xl bg-secondary/70 p-4 text-sm leading-6 text-muted-foreground">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-primary"
            strokeWidth={1.6}
          />
          <p>
            Ihre Kontodaten werden ausschließlich für relevante Informationen
            verwendet. Weitere Details finden Sie in unserer{" "}
            <Link
              className="font-semibold text-foreground underline-offset-4 hover:underline"
              href="/datenschutz"
            >
              Datenschutzerklärung
            </Link>
            .
          </p>
        </section>
      </Container>
    </main>
  );
}
