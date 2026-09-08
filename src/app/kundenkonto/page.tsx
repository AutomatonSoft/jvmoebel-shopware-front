import type { Metadata } from "next";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { AccountPageShell } from "@/features/customer-account/components/account-page-shell";
import { logoutCustomer } from "@/features/customer-account/server/actions";
import { getCustomerAccount } from "@/features/customer-account/server/account";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Kundenkonto | JVMöbel",
};

type CustomerAccountPageProps = Readonly<{
  searchParams: Promise<{ registriert?: string }>;
}>;

export default async function CustomerAccountPage({
  searchParams,
}: CustomerAccountPageProps) {
  const [account, params] = await Promise.all([
    getCustomerAccount(),
    searchParams,
  ]);

  if (account) {
    return (
      <AccountPageShell
        description="Ihr persönlicher Bereich bei JVMöbel."
        title={`Hallo ${account.firstName}`}
      >
        <section>
          {params.registriert === "1" && (
            <p
              className="mb-6 rounded-xl bg-accent/45 px-4 py-3 text-sm font-semibold"
              role="status"
            >
              Ihr Kundenkonto wurde erfolgreich erstellt.
            </p>
          )}
          <dl className="grid gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd className="mt-1 font-semibold">
                {account.firstName} {account.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">E-Mail-Adresse</dt>
              <dd className="mt-1 font-semibold">{account.email}</dd>
            </div>
          </dl>
          <form action={logoutCustomer} className="mt-8">
            <Button type="submit" variant="outline">
              Abmelden
            </Button>
          </form>
        </section>
      </AccountPageShell>
    );
  }

  return (
    <AccountPageShell
      description="Wählen Sie, wie Sie fortfahren möchten."
      title="Ihr Kundenkonto"
    >
      {params.registriert === "1" && (
        <p
          className="mb-6 max-w-3xl rounded-xl bg-accent/45 px-4 py-3 text-sm font-semibold"
          role="status"
        >
          Ihre Registrierung wurde übermittelt. Prüfen Sie gegebenenfalls Ihr
          E-Mail-Postfach, um das Konto zu bestätigen.
        </p>
      )}
      <div className="grid gap-4">
        <section className="rounded-2xl bg-muted/55 p-5 sm:p-6">
          <h2 className="text-xl font-bold">Ich habe bereits ein Konto</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Melden Sie sich mit Ihrer E-Mail-Adresse und Ihrem Passwort an.
          </p>
          <Link
            className={cn(buttonVariants({ className: "mt-6 w-full" }))}
            href="/kundenkonto/anmelden"
          >
            Anmelden
          </Link>
        </section>
        <section className="rounded-2xl border border-border p-5 sm:p-6">
          <h2 className="text-xl font-bold">Ich bin neu hier</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Erstellen Sie in wenigen Schritten Ihr persönliches Kundenkonto.
          </p>
          <Link
            className={cn(
              buttonVariants({ className: "mt-6 w-full", variant: "outline" }),
            )}
            href="/kundenkonto/registrieren"
          >
            Konto erstellen
          </Link>
        </section>
      </div>
    </AccountPageShell>
  );
}
