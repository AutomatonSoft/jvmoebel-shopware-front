"use client";

import { ArrowRight, LockKeyhole, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import { Button } from "@/components/ui/button";

export function CartCheckoutDialog({
  signedIn,
}: Readonly<{ signedIn: boolean }>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (signedIn) {
    return (
      <Button
        className="mt-7 w-full justify-between"
        nativeButton={false}
        render={<Link href="/kasse" />}
        size="lg"
      >
        Zur Kasse gehen
        <span className="grid size-7 place-items-center rounded-full bg-primary-foreground/20">
          <ArrowRight aria-hidden="true" className="size-4" />
        </span>
      </Button>
    );
  }

  return (
    <>
      <Button
        className="mt-7 w-full justify-between"
        onClick={() => dialogRef.current?.showModal()}
        size="lg"
        type="button"
      >
        Zur Kasse gehen
        <span className="grid size-7 place-items-center rounded-full bg-primary-foreground/20">
          <ArrowRight aria-hidden="true" className="size-4" />
        </span>
      </Button>

      <dialog
        aria-labelledby="checkout-dialog-title"
        className="m-auto w-[min(34rem,calc(100%-2rem))] rounded-3xl border bg-card p-0 text-foreground shadow-2xl backdrop:bg-foreground/55 backdrop:backdrop-blur-[2px] open:grid"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            dialogRef.current?.close();
          }
        }}
        ref={dialogRef}
      >
        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[0.65rem] font-semibold tracking-[0.15em] text-primary uppercase">
                Sicherer Checkout
              </p>
              <h2
                className="mt-2 text-2xl font-semibold tracking-[-0.04em]"
                id="checkout-dialog-title"
              >
                Wie möchten Sie fortfahren?
              </h2>
            </div>
            <form method="dialog">
              <button
                aria-label="Dialog schließen"
                className="grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                type="submit"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </form>
          </div>

          <div className="mt-7 grid gap-3">
            <Button
              className="h-13 justify-between"
              nativeButton={false}
              render={
                <Link
                  href={{
                    pathname: "/kundenkonto/anmelden",
                    query: { weiter: "/kasse" },
                  }}
                />
              }
            >
              <span className="flex items-center gap-3">
                <LockKeyhole aria-hidden="true" />
                Mit Kundenkonto fortfahren
              </span>
              <ArrowRight aria-hidden="true" />
            </Button>

            <div className="flex items-center gap-4 py-1 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
              oder
            </div>

            <Button
              className="h-13 justify-between border-foreground/20"
              nativeButton={false}
              render={<Link href="/kasse" />}
              variant="outline"
            >
              <span className="flex items-center gap-3">
                <UserRound aria-hidden="true" />
                Als Gast fortfahren
              </span>
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button
              className="h-13 justify-between"
              nativeButton={false}
              render={
                <Link
                  href={{
                    pathname: "/kundenkonto/registrieren",
                    query: { weiter: "/kasse" },
                  }}
                />
              }
              variant="secondary"
            >
              Neues Kundenkonto erstellen
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
            Für den Gastkauf benötigen Sie kein Passwort. Ihre
            Bestellbestätigung erhalten Sie per E-Mail.
          </p>
        </div>
      </dialog>
    </>
  );
}
