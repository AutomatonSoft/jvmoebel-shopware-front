import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { AccountPageShell } from "@/features/customer-account/components/account-page-shell";
import { logoutCustomer } from "@/features/customer-account/server/actions";
import { getCustomerAccount } from "@/features/customer-account/server/account";

export const metadata: Metadata = {
  title: "Kundenkonto | JVMöbel",
};

type CustomerAccountPageProps = Readonly<{
  searchParams: Promise<{ registriert?: string }>;
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

  return (
    <AccountPageShell
      description="Ihr persönlicher Bereich bei JVMöbel."
      title={`Hallo ${account.firstName}`}
    >
      <section>
        {params.registriert === "1" && (
          <p
            className="mb-6 rounded-xl bg-accent/45 px-4 py-3 text-sm font-semibold"
            role="status"
          >
            Ihr Kundenkonto wurde erfolgreich erstellt.
          </p>
        )}
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
  );
}
