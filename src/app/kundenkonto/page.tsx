import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AccountToast } from "@/features/customer-account/components/account-toast";
import { CustomerProfilePage } from "@/features/customer-account/components/customer-profile-page";
import { getCustomerAccount } from "@/features/customer-account/server/account";

export const metadata: Metadata = {
  description: "Verwalten Sie Ihr persönliches Kundenkonto bei JVMöbel.",
  title: "Mein Kundenkonto | JVMöbel",
};

type CustomerAccountPageProps = Readonly<{
  searchParams: Promise<{ angemeldet?: string; registriert?: string }>;
}>;

export default async function CustomerAccountPage({
  searchParams,
}: CustomerAccountPageProps) {
  const [account, params] = await Promise.all([
    getCustomerAccount(),
    searchParams,
  ]);

  if (!account) {
    redirect("/kundenkonto/registrieren");
  }

  const successToast =
    params.registriert === "1"
      ? {
          description: "Willkommen bei JVMöbel.",
          title: "Konto erfolgreich erstellt",
        }
      : params.angemeldet === "1"
        ? {
            description: `Willkommen zurück, ${account.firstName}.`,
            title: "Erfolgreich angemeldet",
          }
        : null;

  return (
    <>
      <CustomerProfilePage account={account} />
      {successToast && (
        <AccountToast
          {...successToast}
          id={
            params.registriert === "1"
              ? "registration-success"
              : "login-success"
          }
          type="success"
        />
      )}
    </>
  );
}
