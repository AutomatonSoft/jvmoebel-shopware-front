"use client";

import { ArrowRight } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { AddressFields } from "@/features/checkout/components/guest-checkout-form";
import type {
  CheckoutActionState,
  CheckoutCustomer,
  CheckoutOption,
} from "@/features/checkout/model/checkout";
import { saveCustomerCheckoutAddress } from "@/features/checkout/server/actions";
import { AccountToast } from "@/features/customer-account/components/account-toast";

const initialState: CheckoutActionState = { status: "idle" };

export function CustomerCheckoutAddressForm({
  countries,
  customer,
}: Readonly<{
  countries: readonly CheckoutOption[];
  customer: CheckoutCustomer;
}>) {
  const [state, formAction, pending] = useActionState(
    saveCustomerCheckoutAddress,
    initialState,
  );

  return (
    <form action={formAction}>
      <AccountToast
        description={state.message}
        id={`customer-checkout-address-${state.status}`}
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
            Kundenkonto
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
            Liefer- und Rechnungsadresse
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Ergänzen Sie Ihre Adresse einmalig, um die Bestellung abzuschließen.
          </p>
        </div>

        <fieldset className="mt-6">
          <legend className="sr-only">Liefer- und Rechnungsadresse</legend>
          <AddressFields
            countries={countries}
            initialAddress={{
              countryId: customer.countryId,
              firstName: customer.firstName,
              lastName: customer.lastName,
            }}
          />
        </fieldset>

        <Button
          className="mt-7 w-full justify-between disabled:cursor-wait"
          disabled={pending}
          size="lg"
          type="submit"
        >
          {pending
            ? "Adresse wird gespeichert …"
            : "Weiter zu Versand und Zahlung"}
          <ArrowRight aria-hidden="true" />
        </Button>
      </section>
    </form>
  );
}
