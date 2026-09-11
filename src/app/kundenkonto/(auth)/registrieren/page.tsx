import type { Metadata } from "next";

import { RegisterForm } from "@/features/customer-account/components/register-form";
import { getRegistrationOptions } from "@/features/customer-account/server/account";

export const metadata: Metadata = {
  description: "Erstellen Sie Ihr persönliches JVMöbel Kundenkonto.",
  title: "Konto erstellen | JVMöbel",
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

  if (options.countries.length === 0) {
    throw new Error("Shopware registration options are not configured.");
  }

  return (
    <>
      <header>
        <p className="text-[0.65rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Kundenkonto
        </p>
        <h1 className="mt-3 text-2xl leading-tight font-medium tracking-[-0.035em] sm:text-3xl">
          Konto erstellen
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          Einmal registrieren, bei der nächsten Bestellung Zeit sparen.
        </p>
      </header>
      <section className="mt-7">
        <RegisterForm options={options} redirectTo={redirectTo} />
      </section>
    </>
  );
}
