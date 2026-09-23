"use client";

import { MapPin, Phone, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useForm, useWatch, type UseFormRegisterReturn } from "react-hook-form";
import type { z } from "zod";

import { Input } from "@/components/ui/input";
import { CheckoutCountrySelect } from "@/features/checkout/components/checkout-country-select";
import { AccountField } from "@/features/customer-account/components/account-field";
import { AccountToast } from "@/features/customer-account/components/account-toast";
import type {
  CheckoutAddress,
  CheckoutActionState,
  CheckoutOption,
  GuestCheckoutRegistration,
} from "@/features/checkout/model/checkout";
import {
  checkoutAddressFieldMessages,
  guestCheckoutFieldMessages,
  guestCheckoutRegistrationSchema,
} from "@/features/checkout/model/validation";
import { registerCheckoutGuest } from "@/features/checkout/server/actions";

const initialState: CheckoutActionState = { status: "idle" };
const dataProtectionConsentSlotId = "checkout-data-protection-consent";

type GuestCheckoutFormInput = z.input<typeof guestCheckoutRegistrationSchema>;
type GuestCheckoutFormOutput = z.output<typeof guestCheckoutRegistrationSchema>;

type AddressField = keyof CheckoutAddress;

function OptionalField({
  autoComplete,
  defaultValue,
  error,
  id,
  icon: Icon = Phone,
  label,
  name = id,
  registration,
  type = "text",
}: Readonly<{
  autoComplete: string;
  defaultValue?: string;
  error?: string;
  id: string;
  icon?: LucideIcon;
  label: string;
  name?: string;
  registration?: UseFormRegisterReturn;
  type?: "tel" | "text";
}>) {
  return (
    <div className="relative sm:col-span-2">
      <Input
        {...registration}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={Boolean(error) || undefined}
        autoComplete={autoComplete}
        className="peer h-14 rounded-lg border-border/80 bg-card pt-5 pr-3 pb-1 pl-11 shadow-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10"
        defaultValue={defaultValue}
        id={id}
        name={name}
        placeholder=" "
        type={type}
      />
      <Icon
        aria-hidden="true"
        className="pointer-events-none absolute top-5 left-3.5 size-4 text-muted-foreground/70 peer-focus:text-primary"
        strokeWidth={1.5}
      />
      <label
        className="absolute top-2 left-11 text-[0.65rem] leading-4 text-muted-foreground peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[0.65rem] peer-focus:text-primary peer-aria-invalid:top-2 peer-aria-invalid:translate-y-0 peer-aria-invalid:text-[0.65rem] peer-aria-invalid:text-destructive"
        htmlFor={id}
      >
        {label}
      </label>
      {error && (
        <p
          className="mt-1 text-xs leading-4 text-destructive"
          id={`${id}-error`}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function AddressFields({
  countries,
  fieldErrors,
  getClientError,
  initialAddress,
  prefix = "",
  registerField,
}: Readonly<{
  countries: readonly CheckoutOption[];
  fieldErrors?: Readonly<Partial<Record<string, string>>>;
  getClientError?: (field: AddressField) => string | undefined;
  initialAddress?: Partial<CheckoutAddress>;
  prefix?: string;
  registerField?: (field: AddressField) => UseFormRegisterReturn;
}>) {
  const idPrefix = prefix ? prefix.replace(/\.$/, "") : "billing";
  const getError = (field: AddressField) =>
    getClientError?.(field) ?? fieldErrors?.[`${prefix}${field}`];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <AccountField
        autoComplete="given-name"
        defaultValue={initialAddress?.firstName}
        error={getError("firstName")}
        id={`${idPrefix}-firstName`}
        label="Vorname"
        name={`${prefix}firstName`}
        registration={registerField?.("firstName")}
      />
      <AccountField
        autoComplete="family-name"
        defaultValue={initialAddress?.lastName}
        error={getError("lastName")}
        id={`${idPrefix}-lastName`}
        label="Nachname"
        name={`${prefix}lastName`}
        registration={registerField?.("lastName")}
      />
      <AccountField
        autoComplete="street-address"
        className="sm:col-span-2"
        defaultValue={initialAddress?.street}
        error={getError("street")}
        id={`${idPrefix}-street`}
        label="Straße und Hausnummer"
        name={`${prefix}street`}
        registration={registerField?.("street")}
      />
      <OptionalField
        autoComplete="address-line2"
        defaultValue={initialAddress?.additionalAddressLine1}
        error={getError("additionalAddressLine1")}
        id={`${idPrefix}-additionalAddressLine1`}
        icon={MapPin}
        label="Adresszusatz (optional)"
        name={`${prefix}additionalAddressLine1`}
        registration={registerField?.("additionalAddressLine1")}
      />
      <AccountField
        autoComplete="postal-code"
        defaultValue={initialAddress?.zipcode}
        error={getError("zipcode")}
        id={`${idPrefix}-zipcode`}
        label="Postleitzahl"
        name={`${prefix}zipcode`}
        registration={registerField?.("zipcode")}
      />
      <AccountField
        autoComplete="address-level2"
        defaultValue={initialAddress?.city}
        error={getError("city")}
        id={`${idPrefix}-city`}
        label="Ort"
        name={`${prefix}city`}
        registration={registerField?.("city")}
      />
      <CheckoutCountrySelect
        countries={countries}
        defaultValue={initialAddress?.countryId}
        error={getError("countryId")}
        name={`${prefix}countryId`}
        registration={registerField?.("countryId")}
      />
    </div>
  );
}

export function GuestCheckoutForm({
  countries,
  initialRegistration,
  onContinue,
}: Readonly<{
  countries: readonly CheckoutOption[];
  initialRegistration?: GuestCheckoutRegistration;
  onContinue?: (registration: GuestCheckoutRegistration) => void;
}>) {
  const [state, formAction, pending] = useActionState(
    registerCheckoutGuest,
    initialState,
  );
  const defaultCountryId = countries.length === 1 ? countries[0].id : "";
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<GuestCheckoutFormInput, undefined, GuestCheckoutFormOutput>({
    defaultValues: {
      billingAddress: {
        additionalAddressLine1:
          initialRegistration?.billingAddress.additionalAddressLine1 ?? "",
        city: initialRegistration?.billingAddress.city ?? "",
        countryId:
          initialRegistration?.billingAddress.countryId ?? defaultCountryId,
        firstName: initialRegistration?.billingAddress.firstName ?? "",
        lastName: initialRegistration?.billingAddress.lastName ?? "",
        phoneNumber: initialRegistration?.billingAddress.phoneNumber ?? "",
        street: initialRegistration?.billingAddress.street ?? "",
        zipcode: initialRegistration?.billingAddress.zipcode ?? "",
      },
      email: initialRegistration?.email ?? "",
      shippingAddress: {
        additionalAddressLine1:
          initialRegistration?.shippingAddress?.additionalAddressLine1 ?? "",
        city: initialRegistration?.shippingAddress?.city ?? "",
        countryId:
          initialRegistration?.shippingAddress?.countryId ?? defaultCountryId,
        firstName: initialRegistration?.shippingAddress?.firstName ?? "",
        lastName: initialRegistration?.shippingAddress?.lastName ?? "",
        phoneNumber: initialRegistration?.shippingAddress?.phoneNumber ?? "",
        street: initialRegistration?.shippingAddress?.street ?? "",
        zipcode: initialRegistration?.shippingAddress?.zipcode ?? "",
      },
      shippingSameAsBilling: !initialRegistration?.shippingAddress,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(guestCheckoutRegistrationSchema),
    shouldUnregister: true,
  });
  const fieldErrors = state.fieldErrors ?? {};
  const shippingSameAsBilling = useWatch({
    control,
    name: "shippingSameAsBilling",
  });
  const separateShippingAddress = !shippingSameAsBilling;
  const clientFieldErrors = errors as {
    acceptedDataProtection?: unknown;
    billingAddress?: Partial<Record<AddressField, unknown>>;
    email?: unknown;
    shippingAddress?: Partial<Record<AddressField, unknown>>;
  };
  const getAddressError = (
    address: "billingAddress" | "shippingAddress",
    field: AddressField,
  ) =>
    clientFieldErrors[address]?.[field]
      ? checkoutAddressFieldMessages[
          field as keyof typeof checkoutAddressFieldMessages
        ]
      : fieldErrors[`${address}.${field}`];
  const dataProtectionError = clientFieldErrors.acceptedDataProtection
    ? guestCheckoutFieldMessages.acceptedDataProtection
    : fieldErrors.acceptedDataProtection;
  const emailError = clientFieldErrors.email
    ? guestCheckoutFieldMessages.email
    : fieldErrors.email;
  const registerAddressField = (
    address: "billingAddress" | "shippingAddress",
    field: AddressField,
  ) => register(`${address}.${field}` as const);

  const submitGuestCheckout = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);

    void handleSubmit((registration) => {
      if (pending) {
        return;
      }

      if (onContinue) {
        onContinue(registration);
        return;
      }

      startTransition(() => {
        formAction(formData);
      });
    })(event);
  };

  const dataProtectionConsent = (
    <div>
      <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground">
        <input
          {...register("acceptedDataProtection")}
          aria-describedby={
            dataProtectionError
              ? "checkout-accepted-data-protection-error"
              : undefined
          }
          aria-invalid={Boolean(dataProtectionError) || undefined}
          className="mt-0.5 size-4 shrink-0 accent-primary"
          form="guest-checkout-form"
          required
          type="checkbox"
        />
        <span>
          Ich habe die{" "}
          <Link
            className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-primary"
            href="/datenschutz"
          >
            Datenschutzerklärung
          </Link>{" "}
          gelesen und stimme der Verarbeitung meiner Daten zur Abwicklung der
          Bestellung zu.
        </span>
      </label>
      {dataProtectionError && (
        <p
          className="mt-2 text-xs leading-4 text-destructive"
          id="checkout-accepted-data-protection-error"
          role="alert"
        >
          {dataProtectionError}
        </p>
      )}
    </div>
  );

  return (
    <>
      <form
        action={formAction}
        id="guest-checkout-form"
        noValidate
        onSubmit={submitGuestCheckout}
      >
        <AccountToast
          description={state.message}
          id={`guest-checkout-${state.status}`}
          title={
            state.status === "invalid"
              ? "Angaben prüfen"
              : state.status === "error"
                ? "Checkout nicht verfügbar"
                : undefined
          }
          trigger={state}
          type="error"
        />

        <section className="rounded-3xl border bg-card p-5 shadow-[0_24px_70px_-58px_rgba(21,21,19,0.7)] sm:p-7">
          <div className="border-b pb-5">
            <p className="text-[0.65rem] font-semibold tracking-[0.15em] text-primary uppercase">
              Ohne Registrierung
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              Rechnungsadresse
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Wir verwenden diese Angaben nur für Ihre Bestellung und deren
              Abwicklung.
            </p>
          </div>

          <fieldset className="mt-6">
            <legend className="sr-only">
              Kontaktdaten und Rechnungsadresse
            </legend>
            <div className="mb-3 grid gap-3 sm:grid-cols-2">
              <AccountField
                autoComplete="email"
                className="sm:col-span-2"
                error={emailError}
                id="checkout-email"
                label="E-Mail-Adresse"
                name="email"
                registration={register("email")}
                type="email"
              />
              <OptionalField
                autoComplete="tel"
                error={fieldErrors.phoneNumber}
                id="checkout-phone"
                label="Telefonnummer (optional)"
                name="billingAddress.phoneNumber"
                registration={registerAddressField(
                  "billingAddress",
                  "phoneNumber",
                )}
                type="tel"
              />
            </div>
            <AddressFields
              countries={countries}
              fieldErrors={fieldErrors}
              getClientError={(field) =>
                getAddressError("billingAddress", field)
              }
              prefix="billingAddress."
              registerField={(field) =>
                registerAddressField("billingAddress", field)
              }
            />
          </fieldset>

          <label className="mt-6 flex items-start gap-3 rounded-2xl bg-secondary/70 p-4 text-sm leading-6">
            <input
              {...register("shippingSameAsBilling")}
              checked={
                shippingSameAsBilling === true || shippingSameAsBilling === "on"
              }
              className="mt-1 size-4 shrink-0 accent-primary"
              type="checkbox"
            />
            Lieferadresse entspricht der Rechnungsadresse
          </label>

          {separateShippingAddress && (
            <fieldset className="mt-7 border-t pt-7">
              <legend className="mb-5 text-xl font-semibold tracking-[-0.03em]">
                Abweichende Lieferadresse
              </legend>
              <AddressFields
                countries={countries}
                fieldErrors={fieldErrors}
                getClientError={(field) =>
                  getAddressError("shippingAddress", field)
                }
                prefix="shippingAddress."
                registerField={(field) =>
                  registerAddressField("shippingAddress", field)
                }
              />
            </fieldset>
          )}

          <button className="hidden" disabled={pending} type="submit">
            Weiter zu Versand und Zahlung
          </button>
        </section>
      </form>
      {typeof document !== "undefined" &&
        document.getElementById(dataProtectionConsentSlotId) &&
        createPortal(
          dataProtectionConsent,
          document.getElementById(dataProtectionConsentSlotId)!,
        )}
    </>
  );
}
