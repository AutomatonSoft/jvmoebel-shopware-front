"use client";

import type { Route } from "next";
import { useActionState } from "react";

import { Input } from "@/components/ui/input";
import { CheckoutFormActions } from "@/features/checkout/components/checkout-form-actions";
import type { CheckoutActionState } from "@/features/checkout/model/checkout";
import { saveCheckoutEmail } from "@/features/checkout/server/actions";
import { AccountToast } from "@/features/customer-account/components/account-toast";

const initialState: CheckoutActionState = { status: "idle" };

function EmailField({
  autoComplete,
  defaultValue,
  error,
  id,
  label,
  name,
  type = "email",
}: Readonly<{
  autoComplete: string;
  defaultValue?: string;
  error?: string;
  id: string;
  label: string;
  name: string;
  type?: "email" | "password";
}>) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-medium">{label}</span>
      <Input
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={Boolean(error)}
        autoComplete={autoComplete}
        className="mt-2 h-11"
        defaultValue={defaultValue}
        id={id}
        name={name}
        required={name !== "password"}
        type={type}
      />
      {error && (
        <span
          className="mt-1.5 block text-xs text-destructive"
          id={`${id}-error`}
        >
          {error}
        </span>
      )}
    </label>
  );
}

export function CheckoutEmailForm({
  backHref,
  email,
  guest,
}: Readonly<{
  backHref: Route;
  email: string;
  guest: boolean;
}>) {
  const [state, formAction, pending] = useActionState(
    saveCheckoutEmail,
    initialState,
  );
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} id="checkout-email-form">
      <input name="returnTo" type="hidden" value={backHref} />
      <AccountToast
        description={state.message}
        id={`checkout-email-${state.status}`}
        title={
          state.status === "invalid"
            ? "E-Mail-Adresse prüfen"
            : state.status === "error"
              ? "E-Mail-Adresse nicht gespeichert"
              : undefined
        }
        trigger={state}
        type="error"
      />

      <section className="rounded-3xl border bg-card p-5 shadow-[0_24px_70px_-58px_rgba(21,21,19,0.7)] sm:p-7">
        <div className="border-b pb-5">
          <p className="text-[0.65rem] font-semibold tracking-[0.15em] text-primary uppercase">
            Kontaktdaten
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
            E-Mail-Adresse bearbeiten
          </h2>
        </div>

        <div className="mt-6 grid gap-4">
          <EmailField
            autoComplete="email"
            defaultValue={email}
            error={fieldErrors.email}
            id="checkout-email"
            label="E-Mail-Adresse"
            name="email"
          />
          <EmailField
            autoComplete="email"
            error={fieldErrors.emailConfirmation}
            id="checkout-email-confirmation"
            label="E-Mail-Adresse wiederholen"
            name="emailConfirmation"
          />
          {!guest && (
            <EmailField
              autoComplete="current-password"
              error={fieldErrors.password}
              id="checkout-email-password"
              label="Aktuelles Passwort"
              name="password"
              type="password"
            />
          )}
        </div>

        <CheckoutFormActions
          backHref={backHref}
          pending={pending}
          pendingLabel="E-Mail-Adresse wird gespeichert …"
          submitLabel="Änderungen speichern"
        />
      </section>
    </form>
  );
}
