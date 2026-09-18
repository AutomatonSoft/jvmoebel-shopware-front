"use client";

import { Pencil, Save } from "lucide-react";
import { useActionState, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { AccountField } from "@/features/customer-account/components/account-field";
import { AccountToast } from "@/features/customer-account/components/account-toast";
import type { CustomerAccountSummary } from "@/features/customer-account/model/account";
import { saveCustomerSettings } from "@/features/customer-account/server/actions";

const initialState = { status: "idle" } as const;

function EditableField({
  children,
  editing,
  onEdit,
}: Readonly<{ children: ReactNode; editing: boolean; onEdit: () => void }>) {
  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">{children}</div>
      <Button
        aria-label="Feld bearbeiten"
        className="shrink-0"
        onClick={onEdit}
        size="sm"
        type="button"
        variant={editing ? "secondary" : "outline"}
      >
        {editing ? (
          "Fertig"
        ) : (
          <>
            <Pencil aria-hidden="true" />
            Ändern
          </>
        )}
      </Button>
    </div>
  );
}

export function CustomerProfileForm({
  account,
}: Readonly<{ account: CustomerAccountSummary }>) {
  const [state, formAction, pending] = useActionState(
    saveCustomerSettings,
    initialState,
  );
  const fieldErrors = state.fieldErrors ?? {};
  const [editable, setEditable] = useState<
    "firstName" | "lastName" | "email" | null
  >(null);
  const edit = (field: typeof editable) =>
    setEditable((current) => (current === field ? null : field));

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-border bg-card p-4 sm:p-5"
    >
      <AccountToast
        description={state.message}
        id={`settings-${state.status}`}
        title={
          state.status === "invalid"
            ? "Angaben prüfen"
            : state.status === "error"
              ? "Profil nicht gespeichert"
              : undefined
        }
        trigger={state}
        type="error"
      />
      <input name="currentEmail" type="hidden" value={account.email} />
      <div className="grid gap-3 sm:grid-cols-2">
        <EditableField
          editing={editable === "firstName"}
          onEdit={() => edit("firstName")}
        >
          <AccountField
            autoComplete="given-name"
            defaultValue={account.firstName}
            error={fieldErrors.firstName}
            id="profile-first-name"
            label="Vorname"
            name="firstName"
            readOnly={editable !== "firstName"}
          />
        </EditableField>
        <EditableField
          editing={editable === "lastName"}
          onEdit={() => edit("lastName")}
        >
          <AccountField
            autoComplete="family-name"
            defaultValue={account.lastName}
            error={fieldErrors.lastName}
            id="profile-last-name"
            label="Nachname"
            name="lastName"
            readOnly={editable !== "lastName"}
          />
        </EditableField>
      </div>
      <div className="mt-4">
        <EditableField
          editing={editable === "email"}
          onEdit={() => edit("email")}
        >
          <AccountField
            autoComplete="email"
            defaultValue={account.email}
            error={fieldErrors.email}
            id="profile-email"
            label="E-Mail-Adresse"
            name="email"
            readOnly={editable !== "email"}
            type="email"
          />
        </EditableField>
        {editable === "email" && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <AccountField
              autoComplete="email"
              error={fieldErrors.emailConfirmation}
              id="profile-email-confirmation"
              label="E-Mail-Adresse wiederholen"
              name="emailConfirmation"
              type="email"
            />
            <AccountField
              autoComplete="current-password"
              error={fieldErrors.password}
              id="profile-current-password"
              label="Aktuelles Passwort"
              name="password"
              type="password"
            />
          </div>
        )}
      </div>
      <Button className="mt-5" disabled={pending} type="submit">
        <Save aria-hidden="true" />
        {pending ? "Wird gespeichert …" : "Änderungen speichern"}
      </Button>
    </form>
  );
}
