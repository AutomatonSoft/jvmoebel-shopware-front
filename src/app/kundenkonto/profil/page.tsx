import type { Metadata } from "next";
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
      <Container className="max-w-3xl py-10 sm:py-14">
        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          Mein JVMöbel
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
          Kundenprofil
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Ändern Sie hier Ihren Namen. Für die E-Mail-Adresse wenden Sie sich
          bitte an unseren Kundenservice.
        </p>
        <div className="mt-8">
          <CustomerProfileForm account={account} />
        </div>
      </Container>
    </main>
  );
}
