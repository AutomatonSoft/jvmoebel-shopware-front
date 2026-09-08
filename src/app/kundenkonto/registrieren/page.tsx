import type { Metadata } from "next";

import { AccountPageShell } from "@/features/customer-account/components/account-page-shell";
import { RegisterForm } from "@/features/customer-account/components/register-form";
import { getRegistrationOptions } from "@/features/customer-account/server/account";

export const metadata: Metadata = {
  description: "Erstellen Sie Ihr persönliches JVMöbel Kundenkonto.",
  title: "Konto erstellen | JVMöbel",
};

export default async function CustomerRegistrationPage() {
  const options = await getRegistrationOptions();

  if (options.countries.length === 0) {
    throw new Error("Shopware registration options are not configured.");
  }

  return (
    <AccountPageShell
      description="Einmal registrieren, bei der nächsten Bestellung Zeit sparen."
      title="Konto erstellen"
    >
      <RegisterForm options={options} />
    </AccountPageShell>
  );
}
