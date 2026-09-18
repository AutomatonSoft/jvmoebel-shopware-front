"use client";

import { Save } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { AccountField } from "@/features/customer-account/components/account-field";
import { AccountToast } from "@/features/customer-account/components/account-toast";
import type { CustomerAccountSummary } from "@/features/customer-account/model/account";
import { saveCustomerProfile } from "@/features/customer-account/server/actions";

const initialState = { status: "idle" } as const;

export function CustomerProfileForm({
  account,
}: Readonly<{ account: CustomerAccountSummary }>) {
  const [state, formAction, pending] = useActionState(
    saveCustomerProfile,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-3xl border border-border bg-card p-5 sm:p-7"
    >
      <AccountToast
        description={state.message}
        id={`profile-${state.status}`}
        title={
          state.status === "success"
            ? "Profil gespeichert"
            : state.status === "invalid"
              ? "Angaben prüfen"
              : state.status === "error"
                ? "Profil nicht gespeichert"
                : undefined
        }
        trigger={state}
        type={state.status === "success" ? "success" : "error"}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <AccountField
          autoComplete="given-name"
          defaultValue={account.firstName}
          id="profile-first-name"
          label="Vorname"
          name="firstName"
        />
        <AccountField
          autoComplete="family-name"
          defaultValue={account.lastName}
          id="profile-last-name"
          label="Nachname"
          name="lastName"
        />
      </div>
      <div className="mt-3 rounded-xl bg-secondary px-4 py-3">
        <p className="text-xs text-muted-foreground">E-Mail-Adresse</p>
        <p className="mt-1 text-sm font-semibold">{account.email}</p>
      </div>
      <Button className="mt-6" disabled={pending} type="submit">
        <Save aria-hidden="true" />
        {pending ? "Wird gespeichert …" : "Änderungen speichern"}
      </Button>
    </form>
  );
}
