import { BadgeCheck, CircleAlert } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

type EmailConfirmationResultStatus =
  "success" | "already-confirmed" | "invalid";

export function EmailConfirmationResult({
  status,
}: Readonly<{ status: EmailConfirmationResultStatus }>) {
  const successful = status === "success" || status === "already-confirmed";

  return (
    <div className="flex min-h-72 flex-col justify-center py-8">
      <div
        className={
          successful
            ? "grid size-12 place-items-center rounded-full bg-accent text-foreground"
            : "grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive"
        }
      >
        {successful ? (
          <BadgeCheck aria-hidden="true" className="size-6" />
        ) : (
          <CircleAlert aria-hidden="true" className="size-6" />
        )}
      </div>
      <p className="mt-7 text-[0.65rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
        Konto bestätigen
      </p>
      <h1 className="mt-3 text-2xl leading-tight font-medium tracking-[-0.035em] sm:text-3xl">
        {status === "success"
          ? "Ihre E-Mail-Adresse ist bestätigt."
          : status === "already-confirmed"
            ? "Ihre E-Mail-Adresse ist bereits bestätigt."
            : "Dieser Bestätigungslink ist nicht gültig."}
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {successful
          ? "Ihr Kundenkonto ist jetzt aktiviert."
          : "Der Link ist möglicherweise abgelaufen oder wurde bereits verwendet. Bitte registrieren Sie sich erneut oder wenden Sie sich an uns."}
      </p>
      <Link
        className={buttonVariants({ className: "mt-7 w-full" })}
        href={successful ? "/kundenkonto" : "/kundenkonto/registrieren"}
      >
        {successful ? "Zum Kundenkonto" : "Erneut registrieren"}
      </Link>
    </div>
  );
}
