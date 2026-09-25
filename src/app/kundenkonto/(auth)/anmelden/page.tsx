import type { Metadata } from "next";
import { cacheLife } from "next/cache";

import { LoginForm } from "@/features/customer-account/components/login-form";

export const metadata: Metadata = {
  description: "Melden Sie sich bei Ihrem JVMoebel Kundenkonto an.",
  title: "Anmelden | JVMoebel",
};

type CustomerLoginPageProps = Readonly<{
  searchParams: Promise<{ weiter?: string | string[] }>;
}>;

async function CachedLoginForm({
  redirectTo,
}: Readonly<{ redirectTo?: string }>) {
  "use cache";
  cacheLife({ revalidate: 3600, expire: 86400 });

  return <LoginForm redirectTo={redirectTo} />;
}

export default async function CustomerLoginPage({
  searchParams,
}: CustomerLoginPageProps) {
  const parameters = await searchParams;
  const redirectTo = Array.isArray(parameters.weiter)
    ? parameters.weiter[0]
    : parameters.weiter;

  return (
    <section>
      <CachedLoginForm redirectTo={redirectTo} />
    </section>
  );
}
