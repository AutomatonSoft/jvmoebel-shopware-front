"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  AccountActionState,
  RegistrationOptions,
} from "@/features/customer-account/model/account";
import { registerCustomer } from "@/features/customer-account/server/actions";

const initialState: AccountActionState = { status: "idle" };

export function RegisterForm({ options }: { options: RegistrationOptions }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState<"account" | "address">("account");
  const [state, formAction, pending] = useActionState(
    registerCustomer,
    initialState,
  );
  const invalid = state.status === "invalid" || undefined;

  function showAddressStep() {
    const fields = formRef.current?.querySelectorAll<HTMLInputElement>(
      'fieldset[data-step="account"] input',
    );

    if (!fields) {
      return;
    }

    for (const field of fields) {
      if (!field.reportValidity()) {
        return;
      }
    }

    setStep("address");
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-7">
      <div
        className="flex items-center gap-4"
        aria-label="Registrierungsfortschritt"
      >
        <span className="shrink-0 text-xs font-bold tracking-[0.12em] uppercase">
          Schritt {step === "account" ? "1" : "2"} von 2
        </span>
        <div className="grid h-1 flex-1 grid-cols-2 gap-1" aria-hidden="true">
          <span className="rounded-full bg-primary" />
          <span
            className={`rounded-full ${step === "address" ? "bg-primary" : "bg-border"}`}
          />
        </div>
      </div>

      <div className="grid">
        <div
          aria-hidden={step !== "account"}
          className={`col-start-1 row-start-1 space-y-7 transition-opacity duration-150 ${
            step === "account" ? "visible opacity-100" : "invisible opacity-0"
          }`}
          inert={step !== "account"}
        >
          <fieldset className="grid gap-4 sm:grid-cols-2" data-step="account">
            <legend className="sr-only">Persönliche Angaben</legend>
            <div className="mb-1 flex items-center gap-3 sm:col-span-2">
              <span className="grid size-8 place-items-center rounded-full bg-foreground text-xs font-bold text-background">
                01
              </span>
              <h2 className="text-base font-bold">Persönliche Angaben</h2>
            </div>
            <Field
              autoComplete="given-name"
              id="firstName"
              invalid={invalid}
              label="Vorname"
            />
            <Field
              autoComplete="family-name"
              id="lastName"
              invalid={invalid}
              label="Nachname"
            />
            <Field
              autoComplete="email"
              className="sm:col-span-2"
              id="email"
              invalid={invalid}
              label="E-Mail-Adresse"
              type="email"
            />
            <Field
              autoComplete="new-password"
              className="sm:col-span-2"
              id="password"
              invalid={invalid}
              label="Passwort"
              minLength={8}
              type="password"
            />
          </fieldset>

          <Button
            className="w-full justify-between font-bold"
            onClick={showAddressStep}
            size="lg"
            type="button"
          >
            Weiter
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div
          aria-hidden={step !== "address"}
          className={`col-start-1 row-start-1 space-y-7 transition-opacity duration-150 ${
            step === "address" ? "visible opacity-100" : "invisible opacity-0"
          }`}
          inert={step !== "address"}
        >
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="sr-only">Rechnungsadresse</legend>
            <div className="mb-1 flex items-center gap-3 sm:col-span-2">
              <span className="grid size-8 place-items-center rounded-full bg-foreground text-xs font-bold text-background">
                02
              </span>
              <h2 className="text-base font-bold">Rechnungsadresse</h2>
            </div>
            <Field
              autoComplete="street-address"
              className="sm:col-span-2"
              id="street"
              invalid={invalid}
              label="Straße und Hausnummer"
            />
            <Field
              autoComplete="postal-code"
              id="zipcode"
              invalid={invalid}
              label="Postleitzahl"
            />
            <Field
              autoComplete="address-level2"
              id="city"
              invalid={invalid}
              label="Ort"
            />
            {options.countries.length === 1 ? (
              <input
                name="countryId"
                type="hidden"
                value={options.countries[0].id}
              />
            ) : (
              <div className="space-y-2 sm:col-span-2">
                <label
                  className="text-[0.68rem] font-bold tracking-[0.12em] uppercase"
                  htmlFor="countryId"
                >
                  Land
                </label>
                <select
                  className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  defaultValue=""
                  id="countryId"
                  name="countryId"
                  required
                >
                  <option disabled value="">
                    Bitte wählen
                  </option>
                  {options.countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </fieldset>

          <label className="flex items-start gap-3 rounded-2xl bg-muted/55 p-4 text-sm leading-6 text-muted-foreground">
            <input
              className="mt-1 size-4 shrink-0 accent-primary"
              name="acceptedDataProtection"
              required
              type="checkbox"
            />
            <span>
              Ich habe die{" "}
              <Link
                className="font-semibold text-foreground underline decoration-primary underline-offset-4"
                href="/datenschutz"
              >
                Datenschutzerklärung
              </Link>{" "}
              gelesen und stimme der Verarbeitung meiner Daten zu.
            </span>
          </label>

          <p
            aria-live="polite"
            className="min-h-5 text-sm leading-5 text-destructive"
          >
            {state.message}
          </p>
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <Button
              aria-label="Zurück zu den Zugangsdaten"
              disabled={pending}
              onClick={() => setStep("account")}
              size="lg"
              type="button"
              variant="outline"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <Button
              className="w-full justify-between font-bold disabled:cursor-wait"
              disabled={pending}
              size="lg"
              type="submit"
            >
              {pending ? "Konto wird erstellt …" : "Konto erstellen"}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
      <p className="border-t border-border pt-5 text-center text-sm text-muted-foreground">
        Bereits registriert?{" "}
        <Link
          className="font-semibold text-foreground underline decoration-primary underline-offset-4"
          href="/kundenkonto/anmelden"
        >
          Zur Anmeldung
        </Link>
      </p>
    </form>
  );
}

type FieldProps = Readonly<{
  autoComplete: string;
  className?: string;
  id: string;
  invalid?: true;
  label: string;
  minLength?: number;
  type?: "email" | "password" | "text";
}>;

function Field({
  autoComplete,
  className,
  id,
  invalid,
  label,
  minLength,
  type = "text",
}: FieldProps) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <label
        className="text-[0.68rem] font-bold tracking-[0.12em] uppercase"
        htmlFor={id}
      >
        {label}
      </label>
      <Input
        aria-invalid={invalid}
        autoComplete={autoComplete}
        className="h-12 rounded-xl bg-background px-4"
        id={id}
        minLength={minLength}
        name={id}
        required
        type={type}
      />
    </div>
  );
}
