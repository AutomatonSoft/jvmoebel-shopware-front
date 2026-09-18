import type { Metadata } from "next";

import { RegisterForm } from "@/features/customer-account/components/register-form";
import { getRegistrationOptions } from "@/features/customer-account/server/account";

export const metadata: Metadata = {
  description: "Erstellen Sie Ihr persönliches JVMoebel Kundenkonto.",
  title: "Konto erstellen | JVMoebel",
};

type CustomerRegistrationPageProps = Readonly<{
  searchParams: Promise<{ weiter?: string | string[] }>;
}>;

export default async function CustomerRegistrationPage({
  searchParams,
}: CustomerRegistrationPageProps) {
  const [options, parameters] = await Promise.all([
    getRegistrationOptions(),
    searchParams,
  ]);
  const redirectTo = Array.isArray(parameters.weiter)
    ? parameters.weiter[0]
    : parameters.weiter;

  if (!options.defaultCountryId) {
    throw new Error("Shopware registration options are not configured.");
  }

  return (
    <section>
      <RegisterForm options={options} redirectTo={redirectTo} />
    </section>
  );
}
