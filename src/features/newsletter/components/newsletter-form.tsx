"use client";

import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NewsletterActionState } from "@/features/newsletter/model/subscription";

const buttonSizeMap = {
  large: "lg",
  medium: "default",
  small: "sm",
} as const;

export type NewsletterFormProps = {
  buttonLabel: string;
  buttonSize: keyof typeof buttonSizeMap;
  errorMessage: string;
  invalidEmailMessage: string;
  placeholder: string;
  successMessage: string;
};

const initialState: NewsletterActionState = { status: "idle" };

export function NewsletterForm({
  buttonLabel,
  buttonSize,
  errorMessage,
  invalidEmailMessage,
  placeholder,
  successMessage,
}: NewsletterFormProps) {
  const [state, setState] = useState(initialState);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    try {
      const response = await fetch("/store-api/newsletter/subscribe", {
        body: new FormData(event.currentTarget),
        method: "POST",
      });

      if (response.ok) {
        setState({ status: "success" });
      } else if (response.status === 400) {
        setState({ status: "invalid" });
      } else {
        setState({ status: "error" });
      }
    } catch {
      setState({ status: "error" });
    } finally {
      setPending(false);
    }
  }

  if (state.status === "success") {
    return (
      <p className="text-base font-semibold" role="status">
        {successMessage}
      </p>
    );
  }

  return (
    <div>
      <form
        aria-busy={pending}
        className="flex max-w-xl flex-col gap-2 sm:flex-row"
        onSubmit={handleSubmit}
      >
        <Input
          aria-label={placeholder}
          autoComplete="email"
          className="h-13 min-w-0 flex-1 rounded-xl border-foreground/15 bg-background px-5 shadow-none focus-visible:border-foreground/30 focus-visible:ring-primary/15"
          name="email"
          placeholder={placeholder}
          required
          type="email"
        />
        <Button
          className="group w-full justify-between font-bold hover:bg-destructive disabled:cursor-wait motion-safe:active:scale-[.985] sm:w-auto"
          disabled={pending}
          size={buttonSizeMap[buttonSize]}
          type="submit"
        >
          {buttonLabel}
          <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
        </Button>
      </form>
      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-destructive">
        {state.status === "invalid" && invalidEmailMessage}
        {state.status === "error" && errorMessage}
      </p>
    </div>
  );
}
