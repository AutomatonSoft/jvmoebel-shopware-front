"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import type { CheckoutSelectableAddress } from "@/features/checkout/model/checkout";
import { selectCustomerCheckoutDeliveryAddress } from "@/features/checkout/server/actions";
import { AccountToast } from "@/features/customer-account/components/account-toast";

const initialState = { status: "idle" } as const;

export function CheckoutDeliveryAddressSelector({
  addresses,
  selectedAddressId,
}: Readonly<{
  addresses: readonly CheckoutSelectableAddress[];
  selectedAddressId?: string;
}>) {
  const [state, formAction, pending] = useActionState(
    selectCustomerCheckoutDeliveryAddress,
    initialState,
  );

  return (
    <form action={formAction} className="mt-5 border-t pt-5">
      <AccountToast
        description={state.message}
        id={`checkout-delivery-address-${state.status}`}
        title={
          state.status === "error" ? "Adresse nicht ausgewählt" : undefined
        }
        trigger={state}
        type="error"
      />
      <fieldset>
        <legend className="text-xs font-semibold tracking-wide text-foreground uppercase">
          Gespeicherte Adressen
        </legend>
        <div className="mt-3 grid gap-2">
          {addresses.map((address) => (
            <label
              className="flex cursor-pointer items-start gap-3 rounded-xl border bg-background/70 p-3 text-xs transition-[border-color,background-color] has-checked:border-primary has-checked:bg-primary/[0.035] hover:border-foreground/25"
              key={address.id}
            >
              <input
                className="mt-0.5 size-4 shrink-0 accent-primary"
                defaultChecked={address.id === selectedAddressId}
                name="shippingAddressId"
                required
                type="radio"
                value={address.id}
              />
              <span className="leading-5 text-muted-foreground">
                <strong className="block font-semibold text-foreground">
                  {address.firstName} {address.lastName}
                </strong>
                <span className="block">{address.street}</span>
                <span className="block">
                  {address.zipcode} {address.city}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <Button className="mt-4" disabled={pending} size="sm" type="submit">
        {pending ? "Adresse wird gewählt …" : "Adresse verwenden"}
      </Button>
    </form>
  );
}
