import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/ui/container";
import { AccountBackButton } from "@/features/customer-account/components/account-back-button";
import { CustomerProfileForm } from "@/features/customer-account/components/customer-profile-form";
import { getCustomerAccount } from "@/features/customer-account/server/account";

export const metadata: Metadata = { title: "Kundenprofil | JVMoebel" };

export default async function CustomerProfileRoute() {
  const account = await getCustomerAccount();

  if (!account) redirect("/kundenkonto/anmelden");

  return (
    <main className="flex-1">
      <Container className="max-w-3xl py-7 sm:py-9">
        <AccountBackButton />
        <h1 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
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
