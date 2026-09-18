import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Container } from "@/components/ui/container";
import { CustomerAddressForm } from "@/features/customer-account/components/customer-address-form";
import {
  getCustomerAccount,
  getCustomerAddressOptions,
} from "@/features/customer-account/server/account";

export const metadata: Metadata = { title: "Meine Adressen | JVMöbel" };

export default async function CustomerAddressesRoute() {
  const [account, countries] = await Promise.all([
    getCustomerAccount(),
    getCustomerAddressOptions(),
  ]);

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
          Meine Adresse
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Diese Adresse verwenden wir für Ihre Rechnung und Lieferung.
        </p>
        <div className="mt-5">
          <CustomerAddressForm account={account} countries={countries} />
        </div>
      </Container>
    </main>
  );
}
