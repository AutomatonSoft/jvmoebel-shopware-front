import { MapPin } from "lucide-react";

import { CheckoutAddressActions } from "@/features/checkout/components/checkout-address-actions";
import { CheckoutDeliveryAddressSelector } from "@/features/checkout/components/checkout-delivery-address-selector";
import type {
  CheckoutDisplayAddress,
  CheckoutSelectableAddress,
} from "@/features/checkout/model/checkout";

export function CheckoutDeliveryAddress({
  address,
  addresses,
  canAdd,
  canEdit,
  selectedAddressId,
}: Readonly<{
  address: CheckoutDisplayAddress;
  addresses: readonly CheckoutSelectableAddress[];
  canAdd: boolean;
  canEdit: boolean;
  selectedAddressId?: string;
}>) {
  return (
    <section className="rounded-2xl border bg-secondary/35 p-5">
      <div className="relative flex items-center justify-between gap-4 pr-10">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <MapPin aria-hidden="true" className="size-3.5 text-primary" />
          Lieferadresse
        </h2>
        <div className="absolute top-1/2 right-0 -translate-y-1/2">
          <CheckoutAddressActions
            addHref={canAdd ? "/kasse?schritt=neue-lieferadresse" : undefined}
            editHref={canEdit ? "/kasse?schritt=lieferadresse" : undefined}
            label="Lieferadresse"
          />
        </div>
      </div>
      <address className="mt-2 text-sm leading-6 not-italic text-muted-foreground">
        <strong className="block font-semibold text-foreground">
          {address.firstName} {address.lastName}
        </strong>
        <span className="block">{address.street}</span>
        {address.additionalAddressLine1 && (
          <span className="block">{address.additionalAddressLine1}</span>
        )}
        <span className="block">
          {address.zipcode} {address.city}
        </span>
        {address.country && <span className="block">{address.country}</span>}
      </address>
      {canAdd && addresses.length > 1 && (
        <CheckoutDeliveryAddressSelector
          addresses={addresses}
          selectedAddressId={selectedAddressId}
        />
      )}
    </section>
  );
}
