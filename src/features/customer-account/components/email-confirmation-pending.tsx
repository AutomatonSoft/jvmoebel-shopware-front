import { MailCheck } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export function EmailConfirmationPending({
  email,
}: Readonly<{ email?: string }>) {
  return (
    <div className="flex min-h-72 flex-col justify-center py-8">
      <div className="grid size-12 place-items-center rounded-full bg-accent text-foreground">
        <MailCheck aria-hidden="true" className="size-6" />
      </div>
      <p className="mt-7 text-[0.65rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
        Konto bestätigen
      </p>
      <h1 className="mt-3 text-2xl leading-tight font-medium tracking-[-0.035em] sm:text-3xl">
        Prüfen Sie Ihr Postfach.
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Wir haben Ihnen einen Link zur Bestätigung Ihrer E-Mail-Adresse gesendet
        {email ? " an " : "."}
        {email && (
          <strong className="font-medium text-foreground">{email}</strong>
        )}
        {email && "."}
      </p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Erst nach dem Klick auf den Link ist Ihr Kundenkonto aktiviert.
      </p>
      <Link
        className={buttonVariants({
          className: "mt-7 w-full",
          variant: "outline",
        })}
        href="/kundenkonto/anmelden"
      >
        Zur Anmeldung
      </Link>
    </div>
  );
}
