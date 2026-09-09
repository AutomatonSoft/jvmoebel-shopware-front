"use client";

import { ArrowRight } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { AccountField } from "@/features/customer-account/components/account-field";
import { AccountToast } from "@/features/customer-account/components/account-toast";
import type { AccountActionState } from "@/features/customer-account/model/account";
import { loginCustomer } from "@/features/customer-account/server/actions";

const initialState: AccountActionState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginCustomer,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-3">
      <AccountToast
        description={state.message}
        id={`login-${state.status}`}
        title={
          state.status === "invalid"
            ? "Anmeldedaten prüfen"
            : state.status === "error"
              ? "Anmeldung nicht möglich"
              : undefined
        }
        trigger={state}
        type="error"
      />

      <AccountField
        autoComplete="email"
        id="login-email"
        invalid={state.status === "invalid" || undefined}
        label="E-Mail-Adresse"
        name="email"
        type="email"
      />
      <AccountField
        autoComplete="current-password"
        id="login-password"
        invalid={state.status === "invalid" || undefined}
        label="Passwort"
        name="password"
        type="password"
      />

      <Button
        className="mt-3 w-full justify-between rounded-lg bg-foreground text-background hover:bg-foreground/85 disabled:cursor-wait"
        disabled={pending}
        type="submit"
      >
        {pending ? "Anmeldung läuft …" : "Anmelden"}
        <span className="grid size-6 place-items-center rounded-full bg-background/10">
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </span>
      </Button>
    </form>
  );
}
