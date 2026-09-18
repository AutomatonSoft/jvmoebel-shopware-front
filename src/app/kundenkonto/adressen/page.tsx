import type { Metadata } from "next";
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
      <Container className="max-w-3xl py-10 sm:py-14">
        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          Mein JVMöbel
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
          Meine Adresse
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Diese Adresse verwenden wir für Ihre Rechnung und Lieferung.
        </p>
        <div className="mt-8">
          <CustomerAddressForm account={account} countries={countries} />
        </div>
      </Container>
    </main>
  );
}
