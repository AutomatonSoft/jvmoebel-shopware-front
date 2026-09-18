"use client";

import { ArrowRight } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { AccountField } from "@/features/customer-account/components/account-field";
import { AccountToast } from "@/features/customer-account/components/account-toast";
import { SocialAuthButtons } from "@/features/customer-account/components/social-auth-buttons";
import type { AccountActionState } from "@/features/customer-account/model/account";
import { loginCustomer } from "@/features/customer-account/server/actions";

const initialState: AccountActionState = { status: "idle" };

export function LoginForm({ redirectTo }: Readonly<{ redirectTo?: string }>) {
  const [state, formAction, pending] = useActionState(
    loginCustomer,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-2">
      {redirectTo && (
        <input name="redirectTo" type="hidden" value={redirectTo} />
      )}
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

      <SocialAuthButtons mode="login" />

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

      <label className="flex min-h-9 cursor-pointer items-center gap-3 text-sm text-foreground">
        <input
          className="size-4 shrink-0 accent-primary"
          name="rememberMe"
          type="checkbox"
        />
        Angemeldet bleiben
      </label>

      <Button
        className="mt-2 w-full justify-between rounded-lg bg-foreground text-background hover:bg-foreground/85 disabled:cursor-wait"
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
