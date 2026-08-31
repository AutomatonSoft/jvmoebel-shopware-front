"use client";

import Link from "next/link";

import { ArrowRight, Home, RefreshCw, Search, ShoppingBag } from "lucide-react";

type ErrorExperienceProps = {
  code: string;
  eyebrow: string;
  title: string;
  description: string;
  reference?: string;
  retry?: () => void;
  showShopLink?: boolean;
};

export function ErrorExperience({
  code,
  eyebrow,
  title,
  description,
  reference,
  retry,
  showShopLink = true,
}: ErrorExperienceProps) {
  return (
    <main className="relative isolate flex min-h-[72vh] flex-1 items-center overflow-hidden bg-background px-5 py-16 sm:px-8 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 top-12 size-72 rounded-full bg-primary/12 blur-3xl motion-safe:animate-pulse" />
        <div className="absolute -right-24 bottom-0 size-80 rounded-full bg-accent/30 blur-3xl motion-safe:animate-pulse" />

        <div className="absolute left-[8%] top-[16%] h-20 w-32 rotate-[-7deg] rounded-[2rem] border border-foreground/8 bg-white/60 shadow-2xl backdrop-blur-xl motion-safe:animate-[bounce_5s_ease-in-out_infinite]" />
        <div className="absolute right-[10%] top-[20%] size-16 rotate-12 rounded-2xl bg-accent shadow-xl motion-safe:animate-[bounce_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-[13%] left-[15%] h-14 w-14 rotate-45 rounded-2xl bg-primary/90 shadow-xl motion-safe:animate-pulse" />

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground shadow-sm backdrop-blur-xl">
            <span className="size-2 rounded-full bg-primary motion-safe:animate-pulse" />
            {eyebrow}
          </div>

          <p
            aria-hidden="true"
            className="mb-1 bg-gradient-to-br from-foreground via-foreground to-foreground/25 bg-clip-text text-[clamp(5rem,18vw,11rem)] font-black leading-[0.78] tracking-[-0.08em] text-transparent"
          >
            {code}
          </p>

          <h1 className="mt-8 max-w-xl text-balance text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {retry ? (
              <button
                type="button"
                onClick={retry}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                <RefreshCw className="size-4" />
                Erneut versuchen
              </button>
            ) : (
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                <Home className="size-4" />
                Zur Startseite
              </Link>
            )}

            {retry && (
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white/70 px-6 text-sm font-semibold text-foreground backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                <Home className="size-4" />
                Zur Startseite
              </Link>
            )}

            {showShopLink && (
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-transparent px-6 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-secondary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                <ShoppingBag className="size-4" />
                Zum Shop
              </Link>
            )}
          </div>

          {reference && (
            <p className="mt-7 text-xs text-muted-foreground">
              Referenz:{" "}
              <span className="font-mono text-foreground/70">{reference}</span>
            </p>
          )}
        </section>

        <section
          aria-hidden="true"
          className="relative mx-auto hidden aspect-square w-full max-w-md lg:block"
        >
          <div className="absolute inset-[8%] rounded-[3.5rem] border border-border/80 bg-white/55 shadow-[0_40px_100px_-35px_rgba(21,21,19,0.35)] backdrop-blur-2xl" />

          <div className="absolute left-[20%] top-[24%] h-[34%] w-[60%] rounded-[2rem] bg-foreground shadow-2xl">
            <div className="absolute inset-x-[8%] top-[12%] h-[58%] rounded-[1.5rem] bg-background" />
            <div className="absolute bottom-[10%] left-[12%] h-2 w-[34%] rounded-full bg-accent" />
            <div className="absolute bottom-[10%] right-[12%] size-2 rounded-full bg-primary motion-safe:animate-pulse" />
          </div>

          <div className="absolute bottom-[25%] left-[28%] h-[9%] w-[44%] rounded-2xl bg-primary shadow-xl shadow-primary/20" />
          <div className="absolute bottom-[18%] left-[34%] h-[8%] w-[6%] rounded-full bg-foreground" />
          <div className="absolute bottom-[18%] right-[34%] h-[8%] w-[6%] rounded-full bg-foreground" />

          <div className="absolute right-[7%] top-[16%] grid size-14 place-items-center rounded-2xl border border-border bg-accent shadow-xl motion-safe:animate-[bounce_4s_ease-in-out_infinite]">
            <Search className="size-6 text-accent-foreground" />
          </div>

          <div className="absolute bottom-[10%] right-[12%] grid size-12 place-items-center rounded-full bg-foreground text-background shadow-xl">
            <ArrowRight className="size-5" />
          </div>
        </section>
      </div>
    </main>
  );
}
