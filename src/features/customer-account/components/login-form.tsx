"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AccountActionState } from "@/features/customer-account/model/account";
import { loginCustomer } from "@/features/customer-account/server/actions";

const initialState: AccountActionState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginCustomer,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label
          className="text-[0.68rem] font-bold tracking-[0.12em] uppercase"
          htmlFor="login-email"
        >
          E-Mail-Adresse
        </label>
        <Input
          aria-invalid={state.status === "invalid" || undefined}
          autoComplete="email"
          className="h-12 rounded-xl bg-background px-4"
          id="login-email"
          name="email"
          required
          type="email"
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-[0.68rem] font-bold tracking-[0.12em] uppercase"
          htmlFor="login-password"
        >
          Passwort
        </label>
        <Input
          aria-invalid={state.status === "invalid" || undefined}
          autoComplete="current-password"
          className="h-12 rounded-xl bg-background px-4"
          id="login-password"
          name="password"
          required
          type="password"
        />
      </div>
      <p
        aria-live="polite"
        className="min-h-5 text-sm leading-5 text-destructive"
      >
        {state.message}
      </p>
      <Button
        className="mt-2 w-full justify-between font-bold disabled:cursor-wait"
        disabled={pending}
        size="lg"
        type="submit"
      >
        {pending ? "Anmeldung läuft …" : "Anmelden"}
        <ArrowRight className="size-4" />
      </Button>
      <p className="border-t border-border pt-5 text-center text-sm text-muted-foreground">
        Noch kein Konto?{" "}
        <Link
          className="font-semibold text-foreground underline decoration-primary underline-offset-4"
          href="/kundenkonto/registrieren"
        >
          Jetzt registrieren
        </Link>
      </p>
    </form>
  );
}
