import type { Metadata } from "next";
import { redirect, unstable_rethrow } from "next/navigation";

import { AccountToast } from "@/features/customer-account/components/account-toast";
import { CustomerProfilePage } from "@/features/customer-account/components/customer-profile-page";
import { getCustomerAccount } from "@/features/customer-account/server/account";
import { getCustomerAccountOrders } from "@/features/customer-account/server/account";

export const metadata: Metadata = {
  description: "Verwalten Sie Ihr persönliches Kundenkonto bei JVMoebel.",
  title: "Mein Kundenkonto | JVMoebel",
};

type CustomerAccountPageProps = Readonly<{
  searchParams: Promise<{
    angemeldet?: string;
    registriert?: string;
    profil?: string;
    adresse?: string;
    email?: string;
    einstellungen?: string;
  }>;
}>;

export default async function CustomerAccountPage({
  searchParams,
}: CustomerAccountPageProps) {
  const [account, orders, params] = await Promise.all([
    getCustomerAccount(),
    getCustomerAccountOrders().catch((error: unknown) => {
      unstable_rethrow(error);
      console.error("Customer order lookup failed.", error);
      return null;
    }),
    searchParams,
  ]);

  if (!account) {
    redirect("/kundenkonto/anmelden");
  }

  const successToast =
    params.registriert === "1"
      ? {
          description: "Willkommen bei JVMoebel.",
          title: "Konto erfolgreich erstellt",
        }
      : params.einstellungen === "1"
        ? {
            description: "Ihre Angaben wurden aktualisiert.",
            title: "Profil gespeichert",
          }
        : params.profil === "1"
          ? {
              description: "Ihre persönlichen Daten wurden aktualisiert.",
              title: "Profil gespeichert",
            }
          : params.adresse === "1"
            ? {
                description: "Ihre Adresse wurde aktualisiert.",
                title: "Adresse gespeichert",
              }
            : params.email === "1"
              ? {
                  description: "Ihre E-Mail-Adresse wurde aktualisiert.",
                  title: "E-Mail-Adresse gespeichert",
                }
              : params.angemeldet === "1"
                ? {
                    description: `Willkommen zurück, ${account.firstName}.`,
                    title: "Erfolgreich angemeldet",
                  }
                : null;

  return (
    <>
      <CustomerProfilePage account={account} orders={orders} />
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
