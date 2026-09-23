"use client";

import { ArrowRight, Building2, ReceiptText } from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { AccountField } from "@/features/customer-account/components/account-field";
import { AccountToast } from "@/features/customer-account/components/account-toast";
import { SocialAuthButtons } from "@/features/customer-account/components/social-auth-buttons";
import type {
  AccountActionState,
  RegistrationOptions,
} from "@/features/customer-account/model/account";
import {
  customerRegistrationFieldMessages,
  registrationInputSchema,
} from "@/features/customer-account/model/validation";
import { registerCustomer } from "@/features/customer-account/server/actions";

const initialState: AccountActionState = { status: "idle" };

type RegistrationFormInput = z.input<typeof registrationInputSchema>;
type RegistrationFormOutput = z.output<typeof registrationInputSchema>;

export function RegisterForm({
  options,
  redirectTo,
}: Readonly<{ options: RegistrationOptions; redirectTo?: string }>) {
  const [state, formAction, pending] = useActionState(
    registerCustomer,
    initialState,
  );
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<RegistrationFormInput, undefined, RegistrationFormOutput>({
    defaultValues: {
      acceptedDataProtection: true,
      accountType: "private",
      countryId: options.defaultCountryId,
      newsletterConsent: false,
      salutationId: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(registrationInputSchema),
    shouldUnregister: true,
  });
  const fieldErrors = state.fieldErrors ?? {};
  const invalid =
    state.status === "invalid" && !state.fieldErrors ? true : undefined;
  const accountType = useWatch({ control, name: "accountType" });
  const clientFieldErrors = errors as Partial<
    Record<keyof typeof customerRegistrationFieldMessages, unknown>
  >;

  const submitRegistration = handleSubmit((_values, event) => {
    const form = event?.target;

    if (pending || !(form instanceof HTMLFormElement)) {
      return;
    }

    const formData = new FormData(form);

    startTransition(() => {
      formAction(formData);
    });
  });

  const getFieldError = (
    field: keyof typeof customerRegistrationFieldMessages,
  ) =>
    clientFieldErrors[field]
      ? customerRegistrationFieldMessages[field]
      : fieldErrors[field];

  return (
    <form
      action={formAction}
      className="space-y-2"
      noValidate
      onSubmit={submitRegistration}
    >
      {redirectTo && (
        <input name="redirectTo" type="hidden" value={redirectTo} />
      )}
      <input {...register("acceptedDataProtection")} type="hidden" value="on" />
      <input
        {...register("countryId")}
        type="hidden"
        value={options.defaultCountryId}
      />

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
                  {...register("accountType")}
                  checked={accountType === value}
                  className="peer sr-only"
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
              {...register("salutationId")}
              className="h-11 w-full rounded-lg border border-border/80 bg-card/80 px-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10"
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
            error={getFieldError("company")}
            icon={Building2}
            id="company"
            invalid={invalid}
            label="Firmenname inkl. Rechtsform"
            registration={register("company")}
          />
          <AccountField
            autoComplete="off"
            error={getFieldError("vatId")}
            icon={ReceiptText}
            id="vatId"
            invalid={invalid}
            label="USt-Id-Nr. oder Steuernummer"
            registration={register("vatId")}
          />
        </fieldset>
      )}

      <fieldset className="grid gap-2 sm:grid-cols-2">
        <legend className="sr-only">Persönliche Angaben</legend>
        <AccountField
          autoComplete="given-name"
          error={getFieldError("firstName")}
          id="firstName"
          invalid={invalid}
          label="Vorname"
          registration={register("firstName")}
        />
        <AccountField
          autoComplete="family-name"
          error={getFieldError("lastName")}
          id="lastName"
          invalid={invalid}
          label="Nachname"
          registration={register("lastName")}
        />
        <AccountField
          autoComplete="email"
          className="sm:col-span-2"
          error={getFieldError("email")}
          id="email"
          invalid={invalid}
          label="E-Mail-Adresse"
          registration={register("email")}
          type="email"
        />
        <AccountField
          autoComplete="new-password"
          className="sm:col-span-2"
          error={getFieldError("password")}
          id="password"
          invalid={invalid}
          label="Passwort"
          maxLength={72}
          minLength={8}
          registration={register("password")}
          type="password"
        />
      </fieldset>

      <label className="flex cursor-pointer items-start gap-2.5">
        <input
          {...register("newsletterConsent")}
          className="mt-0.5 size-4 shrink-0 rounded border-border accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          type="checkbox"
        />
        <span className="text-xs leading-5 text-muted-foreground">
          <span className="block text-foreground">
            Ja, ich möchte <strong>E-Mail-Nachrichten</strong> erhalten.
          </span>
          <span className="block">
            Eine Abmeldung von den E-Mail-Nachrichten ist jederzeit möglich.*
          </span>
        </span>
      </label>

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
    </form>
  );
}
