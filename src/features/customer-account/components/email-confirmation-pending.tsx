import { MailCheck } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        Geben Sie den Bestätigungscode ein.
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Wir senden Ihnen einen vierstelligen Code zur Bestätigung Ihrer
        E-Mail-Adresse
        {email ? " an " : "."}
        {email && (
          <strong className="font-medium text-foreground">{email}</strong>
        )}
        {email && "."}
      </p>
      <form className="mt-7">
        <fieldset>
          <legend className="sr-only">Vierstelliger Bestätigungscode</legend>
          <div className="grid grid-cols-4 gap-2 sm:max-w-sm">
            {[1, 2, 3, 4].map((position) => (
              <Input
                aria-label={`Ziffer ${position}`}
                className="h-14 px-0 text-center text-xl font-medium tracking-[0.16em]"
                inputMode="numeric"
                key={position}
                maxLength={1}
                pattern="[0-9]*"
                type="text"
              />
            ))}
          </div>
        </fieldset>
        <Button className="mt-4 w-full sm:max-w-sm" disabled type="submit">
          Code bestätigen
        </Button>
      </form>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Die Bestätigung wird aktiviert, sobald der E-Mail-Versand eingerichtet
        ist.
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
