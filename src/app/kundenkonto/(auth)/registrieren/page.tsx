import type { Metadata } from "next";
import { cacheLife } from "next/cache";

import { RegisterForm } from "@/features/customer-account/components/register-form";
import { getRegistrationOptions } from "@/features/customer-account/server/account";
import {
  shopwareCacheLife,
  shopwareCacheTtlSeconds,
} from "@/integrations/shopware/cache-policy";

export const metadata: Metadata = {
  description: "Erstellen Sie Ihr persönliches JVMoebel Kundenkonto.",
  title: "Konto erstellen | JVMoebel",
};

type CustomerRegistrationPageProps = Readonly<{
  searchParams: Promise<{ weiter?: string | string[] }>;
}>;

async function CachedRegistrationForm({
  redirectTo,
}: Readonly<{ redirectTo?: string }>) {
  "use cache";
  cacheLife(shopwareCacheLife(shopwareCacheTtlSeconds.registrationOptions));

  const options = await getRegistrationOptions();

  if (!options.defaultCountryId) {
    throw new Error("Shopware registration options are not configured.");
  }

  return <RegisterForm options={options} redirectTo={redirectTo} />;
}

export default async function CustomerRegistrationPage({
  searchParams,
}: CustomerRegistrationPageProps) {
  const parameters = await searchParams;
  const redirectTo = Array.isArray(parameters.weiter)
    ? parameters.weiter[0]
    : parameters.weiter;

  return (
    <section>
      <CachedRegistrationForm redirectTo={redirectTo} />
    </section>
  );
}
