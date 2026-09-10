import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CartAccountRequired() {
  return (
    <main className="flex-1 bg-[#faf7f2]">
      <div className="mx-auto w-full max-w-360 px-4 py-8 sm:px-8 sm:py-12">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Link className="hover:text-primary" href="/">
            Startseite
          </Link>
          <span aria-hidden="true">/</span>
          <strong className="font-medium text-foreground">Warenkorb</strong>
        </nav>

        <section className="mx-auto mt-8 max-w-2xl rounded-3xl border border-[#dfd3c5] bg-card px-6 py-10 text-center shadow-[0_24px_70px_-56px_rgba(91,67,43,0.5)] sm:px-12 sm:py-14">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <LockKeyhole className="size-5" />
          </span>
          <p className="mt-5 text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            Warenkorb
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Bitte melden Sie sich an
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
            Für den Zugriff auf Ihren Warenkorb benötigen Sie ein Kundenkonto.
            Sie können sich anmelden oder ein neues Konto erstellen.
          </p>

          <div className="mx-auto mt-8 grid max-w-md gap-3 sm:grid-cols-2">
            <Button
              className="justify-between"
              nativeButton={false}
              render={
                <Link
                  href={{
                    pathname: "/kundenkonto/anmelden",
                    query: { weiter: "/warenkorb" },
                  }}
                />
              }
              size="lg"
            >
              Anmelden
              <ArrowRight className="size-4" />
            </Button>
            <Button
              nativeButton={false}
              render={
                <Link
                  href={{
                    pathname: "/kundenkonto/registrieren",
                    query: { weiter: "/warenkorb" },
                  }}
                />
              }
              size="lg"
              variant="outline"
            >
              Konto erstellen
            </Button>
          </div>

          <p className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 border-t border-foreground/10 pt-6 text-xs leading-5 text-muted-foreground">
            <UserRound className="size-4 shrink-0 text-primary" />
            Ihr Warenkorb wird Ihrem Kundenkonto zugeordnet.
          </p>
        </section>
      </div>
    </main>
  );
}
