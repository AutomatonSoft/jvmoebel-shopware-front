"use client";

import { ArrowRight, CreditCard, MessageSquareText, Truck } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { AccountToast } from "@/features/customer-account/components/account-toast";
import type {
  CheckoutActionState,
  CheckoutOption,
} from "@/features/checkout/model/checkout";
import { placeCheckoutOrder } from "@/features/checkout/server/actions";

const initialState: CheckoutActionState = { status: "idle" };

function MethodOptions({
  defaultValue,
  icon: Icon,
  legend,
  name,
  options,
}: Readonly<{
  defaultValue?: string;
  icon: typeof Truck;
  legend: string;
  name: "paymentMethodId" | "shippingMethodId";
  options: readonly CheckoutOption[];
}>) {
  return (
    <fieldset>
      <legend className="flex items-center gap-3 text-xl font-semibold tracking-[-0.03em]">
        <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon aria-hidden="true" className="size-4.5" />
        </span>
        {legend}
      </legend>
      <div className="mt-5 grid gap-3">
        {options.map((option, index) => (
          <label
            className="group flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-[border-color,background-color] has-checked:border-primary has-checked:bg-primary/[0.035] hover:border-foreground/25"
            key={option.id}
          >
            <input
              className="mt-1 size-4 shrink-0 accent-primary"
              defaultChecked={
                option.id === defaultValue || (!defaultValue && index === 0)
              }
              name={name}
              required
              type="radio"
              value={option.id}
            />
            <span>
              <strong className="block text-sm font-semibold">
                {option.label}
              </strong>
              {option.description && (
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {option.description}
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CheckoutPaymentForm({
  paymentMethods,
  selectedPaymentMethodId,
  selectedShippingMethodId,
  shippingMethods,
}: Readonly<{
  paymentMethods: readonly CheckoutOption[];
  selectedPaymentMethodId?: string;
  selectedShippingMethodId?: string;
  shippingMethods: readonly CheckoutOption[];
}>) {
  const [state, formAction, pending] = useActionState(
    placeCheckoutOrder,
    initialState,
  );
  const unavailable =
    paymentMethods.length === 0 || shippingMethods.length === 0;

  return (
    <form action={formAction}>
      <AccountToast
        description={state.message}
        id={`checkout-payment-${state.status}`}
        title={
          state.status === "invalid"
            ? "Auswahl prüfen"
            : state.status === "error"
              ? "Bestellung nicht möglich"
              : undefined
        }
        trigger={state}
        type="error"
      />

      <section className="rounded-3xl border bg-card p-5 shadow-[0_24px_70px_-58px_rgba(21,21,19,0.7)] sm:p-7">
        <div className="grid gap-8 divide-y sm:gap-9">
          <MethodOptions
            defaultValue={selectedShippingMethodId}
            icon={Truck}
            legend="Versandart"
            name="shippingMethodId"
            options={shippingMethods}
          />
          <div className="pt-8 sm:pt-9">
            <MethodOptions
              defaultValue={selectedPaymentMethodId}
              icon={CreditCard}
              legend="Zahlungsart"
              name="paymentMethodId"
              options={paymentMethods}
            />
          </div>
          <div className="pt-8 sm:pt-9">
            <label
              className="flex items-center gap-3 text-sm font-semibold"
              htmlFor="customerComment"
            >
              <MessageSquareText
                aria-hidden="true"
                className="size-4 text-primary"
              />
              Hinweis zur Bestellung (optional)
            </label>
            <textarea
              className="mt-3 min-h-28 w-full resize-y rounded-xl border bg-background p-4 text-sm outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
              id="customerComment"
              maxLength={1000}
              name="customerComment"
              placeholder="Zum Beispiel: Bitte vor der Lieferung anrufen."
            />
          </div>
        </div>

        {unavailable && (
          <p className="mt-7 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-sm leading-6 text-destructive">
            Für diese Bestellung ist derzeit keine passende Versand- oder
            Zahlungsart verfügbar.
          </p>
        )}

        <label className="mt-7 flex items-start gap-3 text-xs leading-5 text-muted-foreground">
          <input
            className="mt-0.5 size-4 shrink-0 accent-primary"
            name="acceptedTerms"
            required
            type="checkbox"
          />
          <span>
            Ich akzeptiere die{" "}
            <Link
              className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-primary"
              href="/agb"
            >
              Allgemeinen Geschäftsbedingungen
            </Link>{" "}
            und habe die Widerrufsbelehrung zur Kenntnis genommen.
          </span>
        </label>

        <Button
          className="mt-7 w-full justify-between disabled:cursor-wait"
          disabled={pending || unavailable}
          size="lg"
          type="submit"
        >
          {pending
            ? "Bestellung wird übermittelt …"
            : "Zahlungspflichtig bestellen"}
          <ArrowRight aria-hidden="true" />
        </Button>
      </section>
    </form>
  );
}
