"use client";

import { ArrowLeft } from "lucide-react";
import { useActionState, useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { CheckoutCartPreview } from "@/features/checkout/components/checkout-cart-preview";
import { CheckoutProgress } from "@/features/checkout/components/checkout-progress";
import { GuestCheckoutForm } from "@/features/checkout/components/guest-checkout-form";
import { CheckoutSummary } from "@/features/checkout/components/checkout-summary";
import type { ShopCart } from "@/features/cart/model/cart";
import type {
  CheckoutActionState,
  CheckoutMethodSelection,
  CheckoutOption,
  GuestCheckoutRegistration,
} from "@/features/checkout/model/checkout";
import { placeGuestCheckoutOrder } from "@/features/checkout/server/actions";

const storageKey = "jv-guest-checkout-draft";
const dataProtectionConsentSlotId = "checkout-data-protection-consent";
const initialState: CheckoutActionState = { status: "idle" };

type GuestDraft = Readonly<{
  registration: GuestCheckoutRegistration;
  selection: CheckoutMethodSelection;
}>;

function DraftInputs({ draft }: Readonly<{ draft: GuestDraft }>) {
  const { registration, selection } = draft;
  const fields = [
    ["email", registration.email],
    ["acceptedDataProtection", "on"],
    ["shippingSameAsBilling", registration.shippingAddress ? "" : "on"],
    ["paymentMethodId", selection.paymentMethodId],
    ["shippingMethodId", selection.shippingMethodId],
    ["customerComment", selection.customerComment ?? ""],
    ...Object.entries(registration.billingAddress).map(([key, value]) => [
      `billingAddress.${key}`,
      value ?? "",
    ]),
    ...Object.entries(registration.shippingAddress ?? {}).map(
      ([key, value]) => [`shippingAddress.${key}`, value ?? ""],
    ),
  ];

  return fields.map(([name, value]) => (
    <input key={name} name={name} type="hidden" value={String(value)} />
  ));
}

export function GuestCheckoutFlow({
  cart,
  countries,
  paymentMethods,
  shippingMethods,
}: Readonly<{
  cart: ShopCart;
  countries: readonly CheckoutOption[];
  paymentMethods: readonly CheckoutOption[];
  shippingMethods: readonly CheckoutOption[];
}>) {
  const [draft, setDraft] = useState<GuestDraft | null>(null);
  const [stage, setStage] = useState<"address" | "payment" | "review">(
    "address",
  );
  const [state, formAction, pending] = useActionState(
    placeGuestCheckoutOrder,
    initialState,
  );

  useEffect(() => {
    const saved = window.sessionStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const timeout = window.setTimeout(() => {
        setDraft(JSON.parse(saved) as GuestDraft);
        setStage("payment");
      }, 0);

      return () => window.clearTimeout(timeout);
    } catch {
      window.sessionStorage.removeItem(storageKey);
    }
  }, []);

  const saveDraft = (next: GuestDraft) => {
    window.sessionStorage.setItem(storageKey, JSON.stringify(next));
    setDraft(next);
  };

  let content: ReactNode;
  let summaryLabel = "Weiter zu Versand und Zahlung";

  if (!draft || stage === "address") {
    content = (
      <GuestCheckoutForm
        countries={countries}
        initialRegistration={draft?.registration}
        onContinue={(registration) => {
          saveDraft({
            registration,
            selection: draft?.selection ?? {
              paymentMethodId: paymentMethods[0]?.id ?? "",
              shippingMethodId: shippingMethods[0]?.id ?? "",
            },
          });
          setStage("payment");
        }}
      />
    );
  } else if (stage === "payment") {
    summaryLabel = "Weiter zur Bestellübersicht";
    content = (
      <form
        id="guest-checkout-form"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          saveDraft({
            ...draft,
            selection: {
              customerComment:
                String(formData.get("customerComment") ?? "") || undefined,
              paymentMethodId: String(formData.get("paymentMethodId") ?? ""),
              shippingMethodId: String(formData.get("shippingMethodId") ?? ""),
            },
          });
          setStage("review");
        }}
      >
        <section className="rounded-3xl border bg-card p-5 sm:p-7">
          <button
            className="text-left"
            onClick={() => setStage("address")}
            type="button"
          >
            <strong className="text-sm">E-Mail-Adresse</strong>
            <span className="mt-2 block text-sm text-muted-foreground">
              {draft.registration.email}
            </span>
          </button>
          <div className="mt-7 grid gap-6 border-t pt-6">
            <fieldset>
              <legend className="text-lg font-semibold">Versandart</legend>
              {shippingMethods.map((option) => (
                <label
                  className="mt-3 flex cursor-pointer gap-3 rounded-xl border p-4"
                  key={option.id}
                >
                  <input
                    defaultChecked={
                      option.id === draft.selection.shippingMethodId
                    }
                    name="shippingMethodId"
                    required
                    type="radio"
                    value={option.id}
                  />
                  <span>
                    <strong className="block text-sm">{option.label}</strong>
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </span>
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend className="text-lg font-semibold">Zahlungsart</legend>
              {paymentMethods.map((option) => (
                <label
                  className="mt-3 flex cursor-pointer gap-3 rounded-xl border p-4"
                  key={option.id}
                >
                  <input
                    defaultChecked={
                      option.id === draft.selection.paymentMethodId
                    }
                    name="paymentMethodId"
                    required
                    type="radio"
                    value={option.id}
                  />
                  <span>
                    <strong className="block text-sm">{option.label}</strong>
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </span>
                </label>
              ))}
            </fieldset>
          </div>
          <div className="mt-7 border-t pt-6">
            <Button
              onClick={() => setStage("address")}
              type="button"
              variant="outline"
            >
              <ArrowLeft aria-hidden="true" />
              Zurück zu den Adressen
            </Button>
          </div>
          <button className="hidden" type="submit">
            Weiter zur Bestellübersicht
          </button>
        </section>
      </form>
    );
  } else {
    summaryLabel = pending
      ? "Bestellung wird übermittelt …"
      : "Zahlungspflichtig bestellen";
    content = (
      <form action={formAction} id="guest-checkout-form">
        <DraftInputs draft={draft} />
        <section className="rounded-3xl border bg-card p-5 sm:p-7">
          <button
            className="text-left"
            onClick={() => setStage("address")}
            type="button"
          >
            <strong className="text-sm">
              Rechnungs- und Lieferadresse ändern
            </strong>
            <span className="mt-2 block text-sm text-muted-foreground">
              {draft.registration.email}
            </span>
          </button>
          <button
            className="mt-5 block text-sm font-semibold"
            onClick={() => setStage("payment")}
            type="button"
          >
            Versand- und Zahlungsart ändern
          </button>
          <label className="mt-7 flex gap-3 text-xs leading-5 text-muted-foreground">
            <input
              className="mt-0.5 size-4 accent-primary"
              name="acceptedTerms"
              required
              type="checkbox"
            />
            Ich akzeptiere die Allgemeinen Geschäftsbedingungen und die
            Widerrufsbelehrung.
          </label>
          {state.message && (
            <p className="mt-3 text-sm text-destructive">{state.message}</p>
          )}
          <div className="mt-7 border-t pt-6">
            <Button
              onClick={() => setStage("payment")}
              type="button"
              variant="outline"
            >
              <ArrowLeft aria-hidden="true" />
              Zurück zu Versand und Zahlung
            </Button>
          </div>
          <button className="hidden" disabled={pending} type="submit">
            Zahlungspflichtig bestellen
          </button>
        </section>
      </form>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-end">
        <CheckoutProgress step={stage} />
      </div>
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] xl:gap-12">
        <div>
          {content}
          <CheckoutCartPreview cart={cart} />
        </div>
        <CheckoutSummary
          action={{
            consentSlotId: dataProtectionConsentSlotId,
            disabled: pending,
            formId: "guest-checkout-form",
            label: summaryLabel,
          }}
          cart={cart}
        />
      </div>
    </div>
  );
}
