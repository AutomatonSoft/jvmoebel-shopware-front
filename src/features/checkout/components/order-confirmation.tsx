import { Check, MailCheck, PackageCheck, UserRoundPlus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CheckoutProgress } from "@/features/checkout/components/checkout-progress";
import { GuestAccountForm } from "@/features/checkout/components/guest-account-form";
import type { CheckoutReceipt } from "@/features/checkout/model/checkout";

export function OrderConfirmation({
  accountCreated,
  paymentPending,
  receipt,
}: Readonly<{
  accountCreated: boolean;
  paymentPending: boolean;
  receipt: CheckoutReceipt;
}>) {
  const total = new Intl.NumberFormat("de-DE", {
    currency: receipt.currency,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(receipt.total);

  return (
    <main className="flex-1 bg-background">
      <Container className="py-10 sm:py-16">
        <div className="mx-auto mb-6 flex max-w-3xl justify-end">
          <CheckoutProgress step="confirmation" />
        </div>
        <section className="mx-auto max-w-3xl overflow-hidden rounded-3xl border bg-card shadow-[0_28px_80px_-58px_rgba(21,21,19,0.75)]">
          <div className="bg-secondary/75 px-6 py-10 text-center sm:px-10 sm:py-14">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-accent text-accent-foreground">
              <Check aria-hidden="true" className="size-7" strokeWidth={2.5} />
            </span>
            <p className="mt-6 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Bestellung eingegangen
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              Vielen Dank für Ihre Bestellung
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              {paymentPending
                ? "Ihre Bestellung wurde angelegt. Falls eine weitere Zahlungsfreigabe nötig ist, erhalten Sie die Details per E-Mail."
                : "Wir haben Ihre Bestellung erfolgreich übernommen und senden Ihnen alle weiteren Informationen per E-Mail."}
            </p>
          </div>

          <div className="grid gap-6 px-6 py-8 sm:grid-cols-2 sm:px-10">
            <div className="rounded-2xl border p-5">
              <span className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <PackageCheck
                  aria-hidden="true"
                  className="size-4 text-primary"
                />
                Bestellnummer
              </span>
              <strong className="mt-3 block text-lg tracking-[-0.025em]">
                {receipt.orderNumber}
              </strong>
            </div>
            <div className="rounded-2xl border p-5">
              <span className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <MailCheck aria-hidden="true" className="size-4 text-primary" />
                Gesamtbetrag
              </span>
              <strong className="mt-3 block text-lg tracking-[-0.025em]">
                {total}
              </strong>
            </div>
          </div>

          {receipt.guest && !accountCreated && (
            <div className="border-t bg-accent/25 px-6 py-8 sm:px-10">
              <div className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-card text-primary shadow-sm">
                  <UserRoundPlus aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold tracking-[-0.03em]">
                    Beim nächsten Mal schneller bestellen
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Legen Sie jetzt nur noch ein Passwort fest. Ihre heutigen
                    Bestelldaten werden für das Kundenkonto übernommen.
                  </p>
                </div>
              </div>
              <GuestAccountForm />
            </div>
          )}

          {accountCreated && (
            <p className="border-t bg-accent/25 px-6 py-6 text-center text-sm font-medium sm:px-10">
              Ihr Kundenkonto wurde erstellt. Sie sind bereits angemeldet.
            </p>
          )}

          <div className="flex flex-col gap-3 border-t px-6 py-7 sm:flex-row sm:justify-center sm:px-10">
            <Button nativeButton={false} render={<Link href="/" />}>
              Zur Startseite
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/moebel-sortiment" />}
              variant="outline"
            >
              Weiter einkaufen
            </Button>
          </div>
        </section>
      </Container>
    </main>
  );
}
