import type { Metadata } from "next";

import { EmailConfirmationResult } from "@/features/customer-account/components/email-confirmation-result";
import { confirmCustomerRegistration } from "@/features/customer-account/server/actions";

export const metadata: Metadata = {
  description: "Bestätigen Sie Ihr JVMoebel Kundenkonto.",
  title: "Konto bestätigt | JVMoebel",
};

type EmailConfirmationPageProps = Readonly<{
  searchParams: Promise<{
    em?: string | string[];
    hash?: string | string[];
  }>;
}>;

export default async function EmailConfirmationPage({
  searchParams,
}: EmailConfirmationPageProps) {
  const parameters = await searchParams;
  const result = await confirmCustomerRegistration({
    em: Array.isArray(parameters.em) ? parameters.em[0] : parameters.em,
    hash: Array.isArray(parameters.hash) ? parameters.hash[0] : parameters.hash,
  });

  return <EmailConfirmationResult status={result.status} />;
}
