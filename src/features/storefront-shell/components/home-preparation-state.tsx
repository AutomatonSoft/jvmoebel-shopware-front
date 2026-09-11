"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowRight, Clock3, ShieldCheck, ShoppingBag } from "lucide-react";

export function HomePreparationState() {
  const router = useRouter();

  return (
    <main className="relative isolate flex min-h-[72vh] flex-1 items-center overflow-hidden bg-background px-5 py-16 sm:px-8 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-10 size-96 rounded-full bg-primary/10 blur-3xl motion-safe:animate-pulse" />
        <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-accent/25 blur-3xl motion-safe:animate-pulse" />

        <div className="absolute left-[9%] top-[17%] h-16 w-28 rotate-[-8deg] rounded-[1.75rem] border border-foreground/8 bg-white/60 shadow-2xl backdrop-blur-xl motion-safe:animate-[bounce_6s_ease-in-out_infinite]" />

        <div className="absolute right-[11%] top-[16%] size-14 rotate-12 rounded-2xl bg-accent shadow-xl motion-safe:animate-[bounce_5s_ease-in-out_infinite]" />

        <div className="absolute bottom-[13%] left-[13%] size-12 rotate-45 rounded-2xl bg-primary/90 shadow-xl motion-safe:animate-pulse" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground shadow-sm backdrop-blur-xl">
            <span className="size-2 rounded-full bg-accent-foreground motion-safe:animate-pulse" />
            JVMöbel Storefront
          </div>

          <h1 className="max-w-2xl text-balance text-4xl font-black tracking-[-0.055em] text-foreground sm:text-5xl lg:text-6xl">
            Unser neuer Shop wird gerade für Sie vorbereitet.
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            Die technische Plattform ist bereits verfügbar. Die Inhalte der
            Startseite werden momentan in unserem Shopsystem eingerichtet und
            anschließend automatisch hier veröffentlicht.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/moebel-sortiment"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <ShoppingBag className="size-4" />
              Zum Shop
            </Link>

            <button
              type="button"
              onClick={() => router.refresh()}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white/70 px-6 text-sm font-semibold text-foreground backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              Erneut prüfen
              <ArrowRight className="size-4" />
            </button>
          </div>

          <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-white/55 p-4 backdrop-blur-xl">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary">
                <Clock3 className="size-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Inhalte werden vorbereitet
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Sobald die CMS-Seite freigegeben ist, erscheint sie
                  automatisch.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-white/55 p-4 backdrop-blur-xl">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent">
                <ShieldCheck className="size-5 text-accent-foreground" />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  System ist erreichbar
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Dies ist keine technische Fehlerseite, sondern ein
                  kontrollierter Zwischenzustand.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-hidden="true"
          className="relative mx-auto hidden aspect-square w-full max-w-md lg:block"
        >
          <div className="absolute inset-[7%] rounded-[3.5rem] border border-border/80 bg-white/55 shadow-[0_40px_100px_-35px_rgba(21,21,19,0.35)] backdrop-blur-2xl" />

          <div className="absolute left-[19%] top-[21%] h-[38%] w-[62%] rounded-[2.25rem] bg-foreground shadow-2xl">
            <div className="absolute inset-x-[8%] top-[10%] h-[62%] overflow-hidden rounded-[1.65rem] bg-background">
              <div className="absolute left-[12%] top-[22%] h-3 w-[48%] rounded-full bg-foreground/15" />
              <div className="absolute left-[12%] top-[42%] h-3 w-[68%] rounded-full bg-foreground/10" />
              <div className="absolute left-[12%] top-[62%] h-3 w-[38%] rounded-full bg-primary/70 motion-safe:animate-pulse" />
            </div>

            <div className="absolute bottom-[9%] left-[12%] h-2 w-[30%] rounded-full bg-accent" />
            <div className="absolute bottom-[9%] right-[12%] flex gap-1">
              <span className="size-2 rounded-full bg-background/30" />
              <span className="size-2 rounded-full bg-primary" />
            </div>
          </div>

          <div className="absolute bottom-[25%] left-[26%] h-[10%] w-[48%] rounded-2xl bg-primary shadow-xl shadow-primary/20" />

          <div className="absolute bottom-[16%] left-[33%] h-[10%] w-[7%] rounded-full bg-foreground" />
          <div className="absolute bottom-[16%] right-[33%] h-[10%] w-[7%] rounded-full bg-foreground" />

          <div className="absolute right-[5%] top-[15%] grid size-16 place-items-center rounded-2xl border border-border bg-accent shadow-xl motion-safe:animate-[bounce_5s_ease-in-out_infinite]">
            <Clock3 className="size-7 text-accent-foreground" />
          </div>
        </section>
      </div>
    </main>
  );
}
