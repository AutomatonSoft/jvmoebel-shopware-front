"use client";

import { ArrowRight, Building2, ReceiptText } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { AccountField } from "@/features/customer-account/components/account-field";
import { AccountToast } from "@/features/customer-account/components/account-toast";
import { SocialAuthButtons } from "@/features/customer-account/components/social-auth-buttons";
import type {
  AccountActionState,
  RegistrationOptions,
} from "@/features/customer-account/model/account";
import { registerCustomer } from "@/features/customer-account/server/actions";

const initialState: AccountActionState = { status: "idle" };

export function RegisterForm({
  options,
  redirectTo,
}: Readonly<{ options: RegistrationOptions; redirectTo?: string }>) {
  const [accountType, setAccountType] = useState<"business" | "private">(
    "private",
  );
  const [state, formAction, pending] = useActionState(
    registerCustomer,
    initialState,
  );
  const fieldErrors = state.fieldErrors ?? {};
  const invalid =
    state.status === "invalid" && !state.fieldErrors ? true : undefined;

  return (
    <form action={formAction} className="space-y-2">
      {redirectTo && (
        <input name="redirectTo" type="hidden" value={redirectTo} />
      )}
      <input name="acceptedDataProtection" type="hidden" value="on" />
      <input name="countryId" type="hidden" value={options.defaultCountryId} />

      <AccountToast
        description={state.message}
        id={`registration-${state.status}`}
        title={
          state.status === "invalid"
            ? "Angaben prüfen"
            : state.status === "error"
              ? "Registrierung nicht möglich"
              : undefined
        }
        trigger={state}
        type="error"
      />

      <SocialAuthButtons mode="register" />

      <div className="grid gap-2 sm:grid-cols-2">
        <fieldset>
          <legend className="mb-1 text-xs font-medium text-foreground">
            Konto auswählen
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {(["private", "business"] as const).map((value) => (
              <label className="cursor-pointer" key={value}>
                <input
                  checked={accountType === value}
                  className="peer sr-only"
                  name="accountType"
                  onChange={() => setAccountType(value)}
                  type="radio"
                  value={value}
                />
                <span className="flex h-11 items-center justify-center rounded-lg border border-border/80 bg-card/80 text-sm font-medium transition-colors peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20">
                  {value === "private" ? "Privat" : "Geschäftlich"}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {options.salutations.length > 0 && (
          <fieldset>
            <legend className="mb-1 text-xs font-medium text-foreground">
              Anrede
            </legend>
            <select
              className="h-11 w-full rounded-lg border border-border/80 bg-card/80 px-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10"
              defaultValue=""
              name="salutationId"
            >
              <option value="">Keine Angabe</option>
              {options.salutations.map((salutation) => (
                <option key={salutation.id} value={salutation.id}>
                  {salutation.label}
                </option>
              ))}
            </select>
          </fieldset>
        )}
      </div>

      {accountType === "business" && (
        <fieldset className="grid gap-2 sm:grid-cols-2">
          <legend className="mb-2 text-xs font-medium text-foreground">
            Firmenangaben
          </legend>
          <AccountField
            autoComplete="organization"
            error={fieldErrors.company}
            icon={Building2}
            id="company"
            invalid={invalid}
            label="Firmenname inkl. Rechtsform"
          />
          <AccountField
            autoComplete="off"
            error={fieldErrors.vatId}
            icon={ReceiptText}
            id="vatId"
            invalid={invalid}
            label="USt-Id-Nr. oder Steuernummer"
          />
        </fieldset>
      )}

      <fieldset className="grid gap-2 sm:grid-cols-2">
        <legend className="sr-only">Persönliche Angaben</legend>
        <AccountField
          autoComplete="given-name"
          error={fieldErrors.firstName}
          id="firstName"
          invalid={invalid}
          label="Vorname"
        />
        <AccountField
          autoComplete="family-name"
          error={fieldErrors.lastName}
          id="lastName"
          invalid={invalid}
          label="Nachname"
        />
        <AccountField
          autoComplete="email"
          className="sm:col-span-2"
          error={fieldErrors.email}
          id="email"
          invalid={invalid}
          label="E-Mail-Adresse"
          type="email"
        />
        <AccountField
          autoComplete="new-password"
          className="sm:col-span-2"
          error={fieldErrors.password}
          id="password"
          invalid={invalid}
          label="Passwort"
          maxLength={72}
          minLength={8}
          type="password"
        />
      </fieldset>

      <p className="text-[0.7rem] leading-4 text-muted-foreground">
        Mit Ihrer Registrierung stimmen Sie unseren{" "}
        <Link
          className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
          href="/agb"
        >
          AGB
        </Link>{" "}
        und den{" "}
        <Link
          className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
          href="/datenschutz"
        >
          Datenschutzbestimmungen
        </Link>{" "}
        zu.
      </p>

      <Button
        className="w-full justify-between rounded-lg bg-foreground text-background hover:bg-foreground/85 disabled:cursor-wait"
        disabled={pending}
        type="submit"
      >
        {pending ? "Konto wird erstellt …" : "Konto erstellen"}
        <span className="grid size-6 place-items-center rounded-full bg-background/10">
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </span>
      </Button>
    </form>
  );
}
