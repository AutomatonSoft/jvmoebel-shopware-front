import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AccountPageShellProps = Readonly<{
  children: ReactNode;
  description: string;
  eyebrow?: string;
  title: string;
}>;

export function AccountPageShell({
  children,
  description,
  eyebrow = "Kundenkonto",
  title,
}: AccountPageShellProps) {
  return (
    <main className="flex-1 px-4 py-6 sm:px-8 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-360">
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Link className="transition-colors hover:text-primary" href="/">
            Startseite
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-foreground">Kundenkonto</span>
        </nav>

        <div className="grid min-h-[38rem] overflow-hidden rounded-[2rem] border border-foreground/10 bg-card shadow-[0_24px_70px_-45px_rgba(21,21,19,0.45)] lg:grid-cols-[minmax(0,1.05fr)_minmax(28rem,0.95fr)]">
          <div className="relative min-h-72 overflow-hidden lg:min-h-full">
            <Image
              alt="Modernes Wohnzimmer mit warmen Naturtönen"
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 54vw, 100vw"
              src="/images/main/hero-editorial.webp"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10 lg:top-80 lg:bottom-auto lg:p-12">
              <p className="flex items-center gap-3 text-[0.65rem] font-bold tracking-[0.22em] uppercase">
                <span className="size-2.5 bg-primary" aria-hidden="true" />
                Ihr Zuhause. Ihr Konto.
              </p>
              <h2 className="mt-5 max-w-xl text-3xl leading-[1.05] font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Schönes Wohnen beginnt mit guten Entscheidungen.
              </h2>
              <ul className="mt-7 hidden gap-3 text-sm font-medium sm:grid sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {[
                  "Bestellungen im Blick",
                  "Adressen speichern",
                  "Schneller einkaufen",
                ].map((benefit) => (
                  <li className="flex items-center gap-2" key={benefit}>
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur-sm">
                      <Check className="size-3" strokeWidth={2.5} />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center px-6 py-10 sm:px-10 sm:py-14 lg:px-12 xl:px-16">
            <div className="mx-auto w-full max-w-xl">
              <p className="text-[0.65rem] font-bold tracking-[0.22em] text-primary uppercase">
                {eyebrow}
              </p>
              <h1 className="mt-3 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
              <div className="mt-8">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
