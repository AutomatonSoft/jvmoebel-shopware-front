"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { AccountToast } from "@/features/customer-account/components/account-toast";
import type { CheckoutActionState } from "@/features/checkout/model/checkout";
import { placeCheckoutOrder } from "@/features/checkout/server/actions";

const initialState: CheckoutActionState = { status: "idle" };

export function CheckoutOrderSubmit({ formId }: Readonly<{ formId: string }>) {
  const [state, formAction, pending] = useActionState(
    placeCheckoutOrder,
    initialState,
  );
  const acceptedTermsError = state.fieldErrors?.acceptedTerms;

  return (
    <form action={formAction} className="mt-6 border-t pt-5" id={formId}>
      <AccountToast
        description={state.message}
        id={`checkout-review-${state.status}`}
        title={
          state.status === "invalid"
            ? "Bestellung prüfen"
            : state.status === "error"
              ? "Bestellung nicht möglich"
              : undefined
        }
        trigger={state}
        type="error"
      />

      <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground">
        <input
          aria-describedby={
            acceptedTermsError ? "checkout-accepted-terms-error" : undefined
          }
          aria-invalid={Boolean(acceptedTermsError) || undefined}
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
      {acceptedTermsError && (
        <p
          className="mt-2 text-xs leading-4 text-destructive"
          id="checkout-accepted-terms-error"
          role="alert"
        >
          {acceptedTermsError}
        </p>
      )}

      <Button
        className="mt-5 w-full justify-between"
        disabled={pending}
        size="lg"
        type="submit"
      >
        {pending
          ? "Bestellung wird übermittelt …"
          : "Zahlungspflichtig bestellen"}
        <ArrowRight aria-hidden="true" />
      </Button>
    </form>
  );
}
