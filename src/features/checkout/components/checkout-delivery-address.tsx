import { MapPin, Pencil, Plus } from "lucide-react";
import Link from "next/link";

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
      <div className="flex items-start justify-between gap-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <MapPin aria-hidden="true" className="size-3.5 text-primary" />
          Lieferadresse
        </h2>
        {(canEdit || canAdd) && (
          <div className="flex items-center gap-1">
            {canEdit && (
              <Link
                aria-label="Lieferadresse ändern"
                className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                href="/kasse?schritt=lieferadresse"
              >
                <Pencil aria-hidden="true" className="size-3.5" />
              </Link>
            )}
            {canAdd && (
              <Link
                aria-label="Neue Lieferadresse"
                className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                href="/kasse?schritt=neue-lieferadresse"
              >
                <Plus aria-hidden="true" className="size-3.5" />
              </Link>
            )}
          </div>
        )}
      </div>
      <address className="mt-4 text-sm leading-6 not-italic text-muted-foreground">
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
