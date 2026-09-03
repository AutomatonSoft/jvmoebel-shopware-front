"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ArrowUpRight, Send, X } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildContractRevocationMailto } from "@/features/storefront-shell/model/contract-revocation";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

export function ContractRevocationDialog() {
  function prepareRevocationEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = getFormValue(formData, "name");
    const contractId = getFormValue(formData, "contractId");
    const email = getFormValue(formData, "email");
    const reason = getFormValue(formData, "reason");

    window.location.assign(
      buildContractRevocationMailto({ contractId, email, name, reason }),
    );
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="bg-footer-accent text-footer-on-accent hover:bg-footer-accent-hover focus-visible:ring-footer-accent/30 mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-5 text-sm font-semibold transition-[background,transform] focus-visible:ring-3 focus-visible:outline-none motion-safe:active:translate-y-px">
        Vertrag widerrufen
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="bg-footer-overlay/25 fixed inset-0 z-60 min-h-dvh backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-70 flex min-h-dvh items-center justify-center overflow-hidden p-3 sm:p-5">
          <Dialog.Popup className="border-footer-border bg-footer-surface text-footer-foreground shadow-footer-dialog relative w-full max-w-lg overflow-hidden rounded-3xl border transition-[transform,opacity] duration-200 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
            <header className="border-footer-border bg-footer-panel border-b px-5 py-3 pr-16 sm:px-6 sm:py-4">
              <Dialog.Title className="text-xl font-semibold tracking-[-0.035em] sm:text-2xl">
                Vertrag widerrufen
              </Dialog.Title>
              <Dialog.Description className="text-footer-secondary mt-1 max-w-lg text-xs leading-4 sm:text-sm sm:leading-5">
                Geben Sie Ihre Vertragsdaten ein. Wir bereiten daraus eine
                E-Mail an JVMöbel vor.
              </Dialog.Description>
            </header>

            <Dialog.Close
              aria-label="Dialog schließen"
              className="border-footer-border bg-footer-surface text-footer-secondary hover:bg-footer-control-hover hover:text-footer-foreground focus-visible:ring-footer-accent/30 absolute top-3 right-4 flex size-9 cursor-pointer items-center justify-center rounded-full border transition-[background,color,transform] focus-visible:ring-3 focus-visible:outline-none motion-safe:active:scale-95 sm:top-4"
            >
              <X className="size-4.5" aria-hidden="true" />
            </Dialog.Close>

            <form
              className="grid gap-2.5 px-5 py-3.5 sm:px-6 sm:py-4"
              onSubmit={prepareRevocationEmail}
            >
              <div className="space-y-1">
                <label
                  className="text-xs leading-4 font-medium"
                  htmlFor="revocation-name"
                >
                  Name <span className="text-footer-accent-hover">*</span>
                </label>
                <Input
                  autoComplete="name"
                  className="border-footer-border text-footer-foreground focus-visible:border-footer-accent focus-visible:ring-footer-accent/15 h-9 rounded-xl bg-white/80 px-3.5 text-sm shadow-none"
                  id="revocation-name"
                  name="name"
                  required
                />
              </div>

              <div className="space-y-1">
                <label
                  className="text-xs leading-4 font-medium"
                  htmlFor="revocation-contract-id"
                >
                  Vertragsidentifikation (z. B. Bestellnummer){" "}
                  <span className="text-footer-accent-hover">*</span>
                </label>
                <Input
                  className="border-footer-border text-footer-foreground focus-visible:border-footer-accent focus-visible:ring-footer-accent/15 h-9 rounded-xl bg-white/80 px-3.5 text-sm shadow-none"
                  id="revocation-contract-id"
                  name="contractId"
                  required
                />
              </div>

              <div className="space-y-1">
                <label
                  className="text-xs leading-4 font-medium"
                  htmlFor="revocation-email"
                >
                  E-Mail-Adresse{" "}
                  <span className="text-footer-accent-hover">*</span>
                </label>
                <Input
                  autoComplete="email"
                  className="border-footer-border text-footer-foreground focus-visible:border-footer-accent focus-visible:ring-footer-accent/15 h-9 rounded-xl bg-white/80 px-3.5 text-sm shadow-none"
                  id="revocation-email"
                  name="email"
                  required
                  type="email"
                />
              </div>

              <div className="space-y-1">
                <label
                  className="text-xs leading-4 font-medium"
                  htmlFor="revocation-reason"
                >
                  Widerrufsgrund{" "}
                  <span className="text-footer-muted">(optional)</span>
                </label>
                <textarea
                  className="border-footer-border text-footer-foreground placeholder:text-footer-placeholder focus-visible:border-footer-accent focus-visible:ring-footer-accent/15 min-h-12 w-full resize-none rounded-xl border bg-white/80 px-3.5 py-2 text-sm outline-none transition-colors focus-visible:ring-3"
                  id="revocation-reason"
                  name="reason"
                  rows={1}
                />
              </div>

              <Button
                className="bg-footer-accent text-footer-on-accent hover:bg-footer-accent-hover h-10 w-full rounded-xl text-sm font-semibold"
                type="submit"
              >
                Widerruf per E-Mail vorbereiten
                <Send className="size-4" aria-hidden="true" />
              </Button>

              <p className="text-footer-muted text-[11px] leading-4">
                Der Widerruf wird erst versendet, wenn Sie die vorbereitete
                E-Mail in Ihrem E-Mail-Programm abschicken.
              </p>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
