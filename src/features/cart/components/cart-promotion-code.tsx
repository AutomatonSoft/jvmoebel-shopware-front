"use client";

import { ChevronDown, LoaderCircle, TicketPercent } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { applyPromotionCode } from "@/features/cart/server/actions";

function ApplyPromotionButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="my-1 mr-1 h-9 shrink-0 rounded-lg px-3 text-xs"
      disabled={pending}
      type="submit"
      variant="secondary"
    >
      {pending ? (
        <>
          <LoaderCircle aria-hidden="true" className="animate-spin" />
          <span className="sr-only">Gutscheincode wird geprüft</span>
        </>
      ) : (
        "Einlösen"
      )}
    </Button>
  );
}

export function CartPromotionCode() {
  return (
    <details className="group mt-5 border-t pt-4">
      <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 rounded-lg text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2.5">
          <TicketPercent
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
          Gutscheincode hinzufügen
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
        />
      </summary>

      <form action={applyPromotionCode} className="mt-3">
        <label className="sr-only" htmlFor="promotion-code">
          Gutscheincode
        </label>
        <div className="flex rounded-xl border bg-background transition-[border-color,box-shadow] focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/10">
          <Input
            autoComplete="off"
            className="h-11 min-w-0 flex-1 rounded-xl border-0 bg-transparent px-3.5 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0"
            id="promotion-code"
            name="code"
            placeholder="Gutscheincode eingeben"
            required
          />
          <ApplyPromotionButton />
        </div>
      </form>
    </details>
  );
}
