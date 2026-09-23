"use client";

import { BadgeCheck } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { AddressFields } from "@/features/checkout/components/guest-checkout-form";
import type { CheckoutOption } from "@/features/checkout/model/checkout";
import { AccountToast } from "@/features/customer-account/components/account-toast";
import type { CustomerAccountSummary } from "@/features/customer-account/model/account";
import { saveCustomerAccountAddress } from "@/features/customer-account/server/actions";

const initialState = { status: "idle" } as const;

export function CustomerAddressForm({
  account,
  countries,
}: Readonly<{
  account: CustomerAccountSummary;
  countries: readonly CheckoutOption[];
}>) {
  const [state, formAction, pending] = useActionState(
    saveCustomerAccountAddress,
    initialState,
  );
  const address = account.billingAddress;
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-border bg-card p-4 sm:p-5"
    >
      <AccountToast
        description={state.message}
        id={`address-${state.status}`}
        title={
          state.status === "success"
            ? "Adresse gespeichert"
            : state.status === "invalid"
              ? "Adresse prüfen"
              : state.status === "error"
                ? "Adresse nicht gespeichert"
                : undefined
        }
        trigger={state}
        type={state.status === "success" ? "success" : "error"}
      />
      <AddressFields
        countries={countries}
        fieldErrors={fieldErrors}
        initialAddress={{
          city: address?.city,
          countryId: address?.countryId,
          firstName: address?.firstName ?? account.firstName,
          lastName: address?.lastName ?? account.lastName,
          street: address?.street,
          zipcode: address?.zipcode,
        }}
      />
      <Button className="mt-6" disabled={pending} type="submit">
        <BadgeCheck aria-hidden="true" strokeWidth={1.8} />
        {pending ? "Wird gespeichert …" : "Adresse speichern"}
      </Button>
    </form>
  );
}
