"use client";

import { ArrowRight } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { AccountField } from "@/features/customer-account/components/account-field";
import { AccountToast } from "@/features/customer-account/components/account-toast";
import type { CheckoutActionState } from "@/features/checkout/model/checkout";
import { convertCheckoutGuest } from "@/features/checkout/server/actions";

const initialState: CheckoutActionState = { status: "idle" };

export function GuestAccountForm() {
  const [state, formAction, pending] = useActionState(
    convertCheckoutGuest,
    initialState,
  );
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form
      action={formAction}
      className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]"
    >
      <AccountToast
        description={state.message}
        id={`guest-conversion-${state.status}`}
        title={
          state.status === "invalid"
            ? "Passwort prüfen"
            : state.status === "error"
              ? "Konto nicht erstellt"
              : undefined
        }
        trigger={state}
        type="error"
      />
      <AccountField
        autoComplete="new-password"
        error={fieldErrors.password}
        id="password"
        label="Passwort festlegen"
        minLength={8}
        type="password"
      />
      <Button
        className="h-14 justify-between disabled:cursor-wait sm:min-w-48"
        disabled={pending}
        type="submit"
      >
        {pending ? "Wird erstellt …" : "Konto erstellen"}
        <ArrowRight aria-hidden="true" />
      </Button>
    </form>
  );
}
