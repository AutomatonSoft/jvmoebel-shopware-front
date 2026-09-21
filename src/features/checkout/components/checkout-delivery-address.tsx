import { MapPin } from "lucide-react";
import Link from "next/link";

import { CheckoutDeliveryAddressSelector } from "@/features/checkout/components/checkout-delivery-address-selector";
import type { CheckoutDisplayAddress } from "@/features/checkout/model/checkout";
import type { CheckoutSelectableAddress } from "@/features/checkout/model/checkout";

export function CheckoutDeliveryAddress({
  address,
  addresses,
  canChange,
  selectedAddressId,
}: Readonly<{
  address: CheckoutDisplayAddress;
  addresses: readonly CheckoutSelectableAddress[];
  canChange: boolean;
  selectedAddressId?: string;
}>) {
  return (
    <section className="rounded-2xl border bg-secondary/35 p-5">
      <div className="flex items-start justify-between gap-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <MapPin aria-hidden="true" className="size-4 text-primary" />
          Lieferadresse
        </h2>
        {canChange && (
          <div className="flex items-center gap-3">
            <Link
              className="text-xs font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
              href="/kasse?schritt=adresse"
            >
              Ändern
            </Link>
            <Link
              className="text-xs font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
              href="/kasse?schritt=neue-lieferadresse"
            >
              Neue Adresse
            </Link>
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
      {canChange && addresses.length > 1 && (
        <CheckoutDeliveryAddressSelector
          addresses={addresses}
          selectedAddressId={selectedAddressId}
        />
      )}
    </section>
  );
}
