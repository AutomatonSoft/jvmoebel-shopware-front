"use client";

import { Save } from "lucide-react";
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

  return (
    <form
      action={formAction}
      className="rounded-3xl border border-border bg-card p-5 sm:p-7"
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
        <Save aria-hidden="true" />
        {pending ? "Wird gespeichert …" : "Adresse speichern"}
      </Button>
    </form>
  );
}
