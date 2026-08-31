"use client";

import { ArrowRight } from "lucide-react";
import { useActionState } from "react";

import {
  subscribeToNewsletter,
  type NewsletterActionState,
} from "@/app/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CmsButtonSize } from "@/features/cms/model/button-size";

const buttonSizeMap = {
  large: "lg",
  medium: "default",
  small: "sm",
} as const;

export type NewsletterFormProps = {
  buttonLabel: string;
  buttonSize: CmsButtonSize;
  errorMessage: string;
  invalidEmailMessage: string;
  placeholder: string;
  storefrontUrl: string;
  successMessage: string;
};

const initialState: NewsletterActionState = { status: "idle" };

export function NewsletterForm({
  buttonLabel,
  buttonSize,
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
