import type { Metadata } from "next";

import { LoginForm } from "@/features/customer-account/components/login-form";

export const metadata: Metadata = {
  description: "Melden Sie sich bei Ihrem JVMöbel Kundenkonto an.",
  title: "Anmelden | JVMöbel",
};

type CustomerLoginPageProps = Readonly<{
  searchParams: Promise<{ weiter?: string | string[] }>;
}>;

export default async function CustomerLoginPage({
  searchParams,
}: CustomerLoginPageProps) {
  const parameters = await searchParams;
  const redirectTo = Array.isArray(parameters.weiter)
    ? parameters.weiter[0]
    : parameters.weiter;

  return (
    <>
      <header>
        <p className="text-[0.65rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Kundenkonto
        </p>
        <h1 className="mt-3 text-2xl leading-tight font-medium tracking-[-0.035em] sm:text-3xl">
          Willkommen zurück
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          Melden Sie sich mit Ihrer E-Mail-Adresse und Ihrem Passwort an.
        </p>
      </header>
      <section className="mt-7">
        <LoginForm redirectTo={redirectTo} />
      </section>
    </>
  );
}
