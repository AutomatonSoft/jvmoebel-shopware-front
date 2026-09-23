"use client";

import type { Route } from "next";
import { useActionState } from "react";

import { CheckoutFormActions } from "@/features/checkout/components/checkout-form-actions";
import { AddressFields } from "@/features/checkout/components/guest-checkout-form";
import type {
  CheckoutActionState,
  CheckoutCustomer,
  CheckoutOption,
} from "@/features/checkout/model/checkout";
import { addCustomerCheckoutDeliveryAddress } from "@/features/checkout/server/actions";
import { AccountToast } from "@/features/customer-account/components/account-toast";

const initialState: CheckoutActionState = { status: "idle" };

export function CustomerCheckoutDeliveryAddressForm({
  backHref,
  countries,
  customer,
}: Readonly<{
  backHref: Route;
  countries: readonly CheckoutOption[];
  customer: CheckoutCustomer;
}>) {
  const [state, formAction, pending] = useActionState(
    addCustomerCheckoutDeliveryAddress,
    initialState,
  );
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} id="customer-checkout-delivery-address-form">
      <input name="returnTo" type="hidden" value={backHref} />
      <AccountToast
        description={state.message}
        id={`customer-checkout-delivery-address-${state.status}`}
        title={
          state.status === "invalid"
            ? "Adresse prüfen"
            : state.status === "error"
              ? "Adresse nicht gespeichert"
              : undefined
        }
        trigger={state}
        type="error"
      />

      <section className="rounded-3xl border bg-card p-5 shadow-[0_24px_70px_-58px_rgba(21,21,19,0.7)] sm:p-7">
        <div className="border-b pb-5">
          <p className="text-[0.65rem] font-semibold tracking-[0.15em] text-primary uppercase">
            Neue Lieferadresse
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
            Wohin sollen wir liefern?
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Diese Adresse wird nur für die Lieferung dieser Bestellung
            verwendet.
          </p>
        </div>

        <fieldset className="mt-6">
          <legend className="sr-only">Neue Lieferadresse</legend>
          <AddressFields
            countries={countries}
            fieldErrors={fieldErrors}
            initialAddress={{
              countryId: customer.countryId,
              firstName: customer.firstName,
              lastName: customer.lastName,
            }}
          />
        </fieldset>

        <CheckoutFormActions
          backHref={backHref}
          pending={pending}
          pendingLabel="Adresse wird gespeichert …"
          submitLabel="Lieferadresse verwenden"
        />
      </section>
    </form>
  );
}
