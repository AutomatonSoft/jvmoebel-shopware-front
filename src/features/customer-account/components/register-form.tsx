"use client";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Globe2,
  House,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { AccountField } from "@/features/customer-account/components/account-field";
import { AccountToast } from "@/features/customer-account/components/account-toast";
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
    <form ref={formRef} action={formAction} className="space-y-6">
      {redirectTo && (
        <input name="redirectTo" type="hidden" value={redirectTo} />
      )}
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

      <ol
        aria-label="Registrierungsfortschritt"
        className="flex items-center gap-4 text-xs"
      >
        <li
          aria-current={step === "account" ? "step" : undefined}
          className="flex flex-1 items-center gap-2.5 text-foreground after:ml-1 after:h-px after:flex-1 after:bg-border"
        >
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-[0.65rem] font-medium text-primary">
            {step === "address" ? (
              <Check aria-hidden="true" className="size-3" />
            ) : (
              "01"
            )}
          </span>
          Zugang
        </li>
        <li
          aria-current={step === "address" ? "step" : undefined}
          className={`flex items-center gap-2.5 ${
            step === "address" ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          <span
            className={`grid size-6 place-items-center rounded-full text-[0.65rem] font-medium ${
              step === "address" ? "bg-primary/10 text-primary" : "bg-muted"
            }`}
          >
            02
          </span>
          Adresse
        </li>
      </ol>

      <div>
        <div
          aria-hidden={step !== "account"}
          className={step === "account" ? "space-y-6" : "hidden"}
          inert={step !== "account"}
        >
          <fieldset className="grid gap-3 sm:grid-cols-2" data-step="account">
            <legend className="sr-only">Persönliche Angaben</legend>
            <AccountField
              autoComplete="given-name"
              id="firstName"
              invalid={invalid}
              label="Vorname"
            />
            <AccountField
              autoComplete="family-name"
              id="lastName"
              invalid={invalid}
              label="Nachname"
            />
            <AccountField
              autoComplete="email"
              className="sm:col-span-2"
              id="email"
              invalid={invalid}
              label="E-Mail-Adresse"
              type="email"
            />
            <AccountField
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
            className="w-full justify-between rounded-lg bg-foreground text-background hover:bg-foreground/85"
            onClick={showAddressStep}
            type="button"
          >
            Weiter
            <span className="grid size-6 place-items-center rounded-full bg-background/10">
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </span>
          </Button>
        </div>

        <div
          aria-hidden={step !== "address"}
          className={step === "address" ? "space-y-6" : "hidden"}
          inert={step !== "address"}
        >
          <fieldset className="grid gap-3 sm:grid-cols-2">
            <legend className="sr-only">Rechnungsadresse</legend>
            <AccountField
              autoComplete="street-address"
              className="sm:col-span-2"
              icon={House}
              id="street"
              invalid={invalid}
              label="Straße und Hausnummer"
            />
            <AccountField
              autoComplete="postal-code"
              icon={MapPin}
              id="zipcode"
              invalid={invalid}
              label="Postleitzahl"
            />
            <AccountField
              autoComplete="address-level2"
              icon={Building2}
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
              <div className="relative sm:col-span-2">
                <label
                  className="absolute top-2 left-11 text-[0.65rem] leading-4 text-muted-foreground"
                  htmlFor="countryId"
                >
                  Land
                </label>
                <select
                  aria-invalid={invalid}
                  className="h-14 w-full appearance-none rounded-lg border border-border/80 bg-card/80 pt-5 pr-10 pb-1 pl-11 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10 aria-invalid:border-destructive md:text-sm"
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
                <Globe2
                  aria-hidden="true"
                  className="pointer-events-none absolute top-5 left-3.5 size-4 text-muted-foreground/70"
                  strokeWidth={1.5}
                />
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-5 right-3.5 size-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </div>
            )}
          </fieldset>

          <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground">
            <input
              className="mt-0.5 size-4 shrink-0 accent-primary"
              name="acceptedDataProtection"
              required
              type="checkbox"
            />
            <span>
              Ich habe die{" "}
              <Link
                className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
                href="/datenschutz"
              >
                Datenschutzerklärung
              </Link>{" "}
              gelesen und stimme der Verarbeitung meiner Daten zu.
            </span>
          </label>

          <div className="grid grid-cols-[2.75rem_1fr] gap-2">
            <Button
              aria-label="Zurück zu den Zugangsdaten"
              className="rounded-lg px-0"
              disabled={pending}
              onClick={() => setStep("account")}
              type="button"
              variant="outline"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
            </Button>
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
          </div>
        </div>
      </div>
    </form>
  );
}
