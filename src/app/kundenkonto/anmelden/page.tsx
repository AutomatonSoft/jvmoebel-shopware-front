import type { Metadata } from "next";

import { AccountPageShell } from "@/features/customer-account/components/account-page-shell";
import { LoginForm } from "@/features/customer-account/components/login-form";

export const metadata: Metadata = {
  description: "Melden Sie sich bei Ihrem JVMöbel Kundenkonto an.",
  title: "Anmelden | JVMöbel",
};

export default function CustomerLoginPage() {
  return (
    <AccountPageShell
      description="Melden Sie sich mit Ihrer E-Mail-Adresse und Ihrem Passwort an."
      title="Willkommen zurück"
    >
      <LoginForm />
    </AccountPageShell>
  );
}
