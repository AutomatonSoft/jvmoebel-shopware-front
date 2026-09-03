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
      <Dialog.Trigger className="mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-[#cf7859] px-5 text-sm font-semibold text-[#fffaf5] transition-[background,transform] hover:bg-[#b96548] focus-visible:ring-3 focus-visible:ring-[#cf7859]/30 focus-visible:outline-none motion-safe:active:translate-y-px">
        Vertrag widerrufen
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-60 min-h-dvh bg-[#4d5148]/25 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-70 flex min-h-dvh items-center justify-center overflow-hidden p-3 sm:p-5">
          <Dialog.Popup className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#d8d4ca] bg-[#faf8f2] text-[#485047] shadow-[0_24px_80px_-28px_rgba(72,80,71,0.35)] transition-[transform,opacity] duration-200 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
            <header className="border-b border-[#d8d4ca] bg-[#eef0e8] px-5 py-3 pr-16 sm:px-6 sm:py-4">
              <Dialog.Title className="text-xl font-semibold tracking-[-0.035em] sm:text-2xl">
                Vertrag widerrufen
              </Dialog.Title>
              <Dialog.Description className="mt-1 max-w-lg text-xs leading-4 text-[#687067] sm:text-sm sm:leading-5">
                Geben Sie Ihre Vertragsdaten ein. Wir bereiten daraus eine
                E-Mail an JVMöbel vor.
              </Dialog.Description>
            </header>

            <Dialog.Close
              aria-label="Dialog schließen"
              className="absolute top-3 right-4 flex size-9 cursor-pointer items-center justify-center rounded-full border border-[#d8d4ca] bg-[#faf8f2] text-[#687067] transition-[background,color,transform] hover:bg-[#e3e7de] hover:text-[#485047] focus-visible:ring-3 focus-visible:ring-[#cf7859]/30 focus-visible:outline-none motion-safe:active:scale-95 sm:top-4"
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
                  Name <span className="text-[#b65d43]">*</span>
                </label>
                <Input
                  autoComplete="name"
                  className="h-9 rounded-xl border-[#d8d4ca] bg-white/80 px-3.5 text-sm text-[#485047] shadow-none focus-visible:border-[#cf7859] focus-visible:ring-[#cf7859]/15"
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
                  <span className="text-[#b65d43]">*</span>
                </label>
                <Input
                  className="h-9 rounded-xl border-[#d8d4ca] bg-white/80 px-3.5 text-sm text-[#485047] shadow-none focus-visible:border-[#cf7859] focus-visible:ring-[#cf7859]/15"
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
                  E-Mail-Adresse <span className="text-[#b65d43]">*</span>
                </label>
                <Input
                  autoComplete="email"
                  className="h-9 rounded-xl border-[#d8d4ca] bg-white/80 px-3.5 text-sm text-[#485047] shadow-none focus-visible:border-[#cf7859] focus-visible:ring-[#cf7859]/15"
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
                  <span className="text-[#7b8279]">(optional)</span>
                </label>
                <textarea
                  className="min-h-12 w-full resize-none rounded-xl border border-[#d8d4ca] bg-white/80 px-3.5 py-2 text-sm text-[#485047] outline-none transition-colors placeholder:text-[#858b83] focus-visible:border-[#cf7859] focus-visible:ring-3 focus-visible:ring-[#cf7859]/15"
                  id="revocation-reason"
                  name="reason"
                  rows={1}
                />
              </div>

              <Button
                className="h-10 w-full rounded-xl bg-[#cf7859] text-sm font-semibold text-[#fffaf5] hover:bg-[#b96548]"
                type="submit"
              >
                Widerruf per E-Mail vorbereiten
                <Send className="size-4" aria-hidden="true" />
              </Button>

              <p className="text-[11px] leading-4 text-[#747b72]">
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
