import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/ui/container";
import { AccountBackButton } from "@/features/customer-account/components/account-back-button";
import { CustomerAddressForm } from "@/features/customer-account/components/customer-address-form";
import {
  getCustomerAccount,
  getCustomerAddressOptions,
} from "@/features/customer-account/server/account";

export const metadata: Metadata = { title: "Meine Adressen | JVMoebel" };

export default async function CustomerAddressesRoute() {
  const [account, countries] = await Promise.all([
    getCustomerAccount(),
    getCustomerAddressOptions(),
  ]);

  if (!account) redirect("/kundenkonto/anmelden");

  return (
    <main className="flex-1">
      <Container className="max-w-3xl py-7 sm:py-9">
        <AccountBackButton />
        <h1 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
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
