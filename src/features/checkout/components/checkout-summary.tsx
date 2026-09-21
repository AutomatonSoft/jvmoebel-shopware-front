import { ArrowRight, Check, PackageCheck, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ShopCart } from "@/features/cart/model/cart";

export type CheckoutSummaryAction = Readonly<{
  disabled?: boolean;
  formId: string;
  label: string;
}>;

export function CheckoutSummary({
  action,
  cart,
}: Readonly<{
  action: CheckoutSummaryAction;
  cart: ShopCart;
}>) {
  const formatter = new Intl.NumberFormat(cart.locale, {
    currency: cart.currency,
    minimumFractionDigits: 2,
    style: "currency",
  });
  const itemCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <aside className="rounded-3xl border bg-card p-6 shadow-[0_24px_70px_-58px_rgba(21,21,19,0.7)] lg:sticky lg:top-24 sm:p-7">
      <div className="flex items-baseline justify-between gap-4 border-b pb-5">
        <h2 className="text-xl font-semibold tracking-[-0.035em]">
          Zusammenfassung
        </h2>
        <span className="text-xs text-muted-foreground">
          {itemCount} {itemCount === 1 ? "Artikel" : "Artikel"}
        </span>
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4 text-muted-foreground">
          <dt>Zwischensumme</dt>
          <dd>{formatter.format(cart.subtotal)}</dd>
        </div>
        {cart.adjustments.map((adjustment) => (
          <div
            className="flex justify-between gap-4 text-primary"
            key={adjustment.id}
          >
            <dt>{adjustment.label}</dt>
            <dd>{formatter.format(adjustment.price)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 text-muted-foreground">
          <dt>Versand</dt>
          <dd>
            {cart.shippingCosts === 0
              ? "Kostenlos"
              : formatter.format(cart.shippingCosts)}
          </dd>
        </div>
        <div className="flex items-end justify-between gap-4 border-t pt-5">
          <dt className="font-semibold">Gesamtsumme</dt>
          <dd className="text-2xl font-semibold tracking-[-0.04em]">
            {formatter.format(cart.total)}
          </dd>
        </div>
      </dl>

      <Button
        className="mt-6 w-full justify-between"
        disabled={action.disabled}
        form={action.formId}
        size="lg"
        type="submit"
      >
        {action.label}
        <ArrowRight aria-hidden="true" />
      </Button>

      <ul className="mt-6 grid gap-3 border-t pt-6 text-xs text-muted-foreground">
        <li className="flex items-center gap-2.5">
          <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
          Sicher verschlüsselte Bestellung
        </li>
        <li className="flex items-center gap-2.5">
          <PackageCheck aria-hidden="true" className="size-4 text-primary" />
          Liefertermin wird transparent angezeigt
        </li>
        <li className="flex items-center gap-2.5">
          <Check aria-hidden="true" className="size-4 text-primary" />
          Bestellbestätigung per E-Mail
        </li>
      </ul>
    </aside>
  );
}
