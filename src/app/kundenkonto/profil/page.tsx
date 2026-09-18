import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Container } from "@/components/ui/container";
import { CustomerProfileForm } from "@/features/customer-account/components/customer-profile-form";
import { getCustomerAccount } from "@/features/customer-account/server/account";

export const metadata: Metadata = { title: "Kundenprofil | JVMöbel" };

export default async function CustomerProfileRoute() {
  const account = await getCustomerAccount();

  if (!account) redirect("/kundenkonto/anmelden");

  return (
    <main className="flex-1">
      <Container className="max-w-3xl py-7 sm:py-9">
        <Link
          className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
          href="/kundenkonto"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Zurück zum Kundenkonto
        </Link>
        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          Mein JVMöbel
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
          Kundenprofil
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Ändern Sie hier Ihren Namen und Ihre E-Mail-Adresse.
        </p>
        <div className="mt-5">
          <CustomerProfileForm account={account} />
        </div>
      </Container>
    </main>
  );
}
