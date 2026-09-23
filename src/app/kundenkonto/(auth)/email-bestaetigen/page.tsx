import type { Metadata } from "next";

import { EmailConfirmationPending } from "@/features/customer-account/components/email-confirmation-pending";

export const metadata: Metadata = {
  description:
    "Bestätigen Sie Ihre E-Mail-Adresse, um Ihr JVMoebel Kundenkonto zu aktivieren.",
  title: "E-Mail bestätigen | JVMoebel",
};

type EmailConfirmationPendingPageProps = Readonly<{
  searchParams: Promise<{ email?: string | string[] }>;
}>;

export default async function EmailConfirmationPendingPage({
  searchParams,
}: EmailConfirmationPendingPageProps) {
  const parameters = await searchParams;
  const email = Array.isArray(parameters.email)
    ? parameters.email[0]
    : parameters.email;

  return <EmailConfirmationPending email={email} />;
}
