import type { Metadata } from "next";

import { LoginForm } from "@/features/customer-account/components/login-form";

export const metadata: Metadata = {
  description: "Melden Sie sich bei Ihrem JVMoebel Kundenkonto an.",
  title: "Anmelden | JVMoebel",
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
    <section>
      <LoginForm redirectTo={redirectTo} />
    </section>
  );
}
