"use client";

import { ArrowRight } from "lucide-react";
import { useActionState } from "react";

import {
  subscribeToNewsletter,
  type NewsletterActionState,
} from "@/app/actions/newsletter";

export type NewsletterFormProps = {
  buttonLabel: string;
  errorMessage: string;
  invalidEmailMessage: string;
  placeholder: string;
  storefrontUrl: string;
  successMessage: string;
};

const initialState: NewsletterActionState = { status: "idle" };

export function NewsletterForm({
  buttonLabel,
  errorMessage,
  invalidEmailMessage,
  placeholder,
  storefrontUrl,
  successMessage,
}: NewsletterFormProps) {
  const action = subscribeToNewsletter.bind(null, storefrontUrl);
  const [state, formAction, pending] = useActionState(action, initialState);

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
        action={formAction}
        className="flex max-w-xl flex-col gap-2 sm:flex-row"
      >
        <input
          aria-label={placeholder}
          autoComplete="email"
          className="min-h-14 min-w-0 flex-1 rounded-xl border border-foreground/15 bg-background px-5 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-foreground/30 focus:ring-3 focus:ring-primary/15"
          name="email"
          placeholder={placeholder}
          required
          type="email"
        />
        <button
          className="group flex min-h-14 items-center justify-between gap-6 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-[background,opacity,transform] hover:bg-destructive disabled:cursor-wait disabled:opacity-60 motion-safe:active:translate-y-px motion-safe:active:scale-[.985]"
          disabled={pending}
          type="submit"
        >
          {buttonLabel}
          <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
        </button>
      </form>
      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-destructive">
        {state.status === "invalid" && invalidEmailMessage}
        {state.status === "error" && errorMessage}
      </p>
    </div>
  );
}
