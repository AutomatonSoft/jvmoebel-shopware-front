import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { checkoutActionButtonClassName } from "@/features/checkout/components/checkout-action-button-style";
import { cn } from "@/lib/utils";

export function CheckoutFormActions({
  backHref,
  pending,
  pendingLabel,
  submitLabel,
}: Readonly<{
  backHref: Route;
  pending: boolean;
  pendingLabel: string;
  submitLabel: string;
}>) {
  return (
    <div className="mt-7 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
      <Link
        className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
        href={backHref}
      >
        <ArrowLeft aria-hidden="true" />
        Zurück
      </Link>
      <Button
        className={checkoutActionButtonClassName}
        disabled={pending}
        type="submit"
        variant="outline"
      >
        {pending ? pendingLabel : submitLabel}
        <ArrowRight aria-hidden="true" />
      </Button>
    </div>
  );
}
