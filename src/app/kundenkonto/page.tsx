import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { AccountPageShell } from "@/features/customer-account/components/account-page-shell";
import { AccountToast } from "@/features/customer-account/components/account-toast";
import { logoutCustomer } from "@/features/customer-account/server/actions";
import { getCustomerAccount } from "@/features/customer-account/server/account";

export const metadata: Metadata = {
  title: "Kundenkonto | JVMöbel",
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
      <AccountPageShell
        description="Ihr persönlicher Bereich bei JVMöbel."
        title={`Hallo ${account.firstName}`}
      >
        <section>
          <dl className="grid gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd className="mt-1 font-semibold">
                {account.firstName} {account.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">E-Mail-Adresse</dt>
              <dd className="mt-1 font-semibold">{account.email}</dd>
            </div>
          </dl>
          <form action={logoutCustomer} className="mt-8">
            <Button type="submit" variant="outline">
              Abmelden
            </Button>
          </form>
        </section>
      </AccountPageShell>
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
