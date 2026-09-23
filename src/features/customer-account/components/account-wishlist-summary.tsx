"use client";

import { ArrowUpRight, Heart } from "lucide-react";
import Link from "next/link";

import { useWishlist } from "@/features/wishlist/hooks/use-wishlist";

export function AccountWishlistSummary() {
  const { isReady, productIds } = useWishlist();
  const count = productIds.length;
  const label =
    count === 1
      ? "1 Artikel auf Ihrer Wunschliste"
      : `${count} Artikel auf Ihrer Wunschliste`;

  return (
    <section aria-labelledby="wishlist-title">
      <h2
        className="flex items-center gap-3 text-xl font-semibold tracking-[-0.035em] before:h-px before:w-5 before:bg-primary"
        id="wishlist-title"
      >
        Wunschliste
      </h2>
      <div className="mt-4 rounded-3xl border border-border/80 bg-card p-5 shadow-[0_20px_50px_-45px_rgba(21,21,19,0.7)]">
        <span className="grid size-9 place-items-center rounded-full bg-secondary text-primary">
          <Heart aria-hidden="true" className="size-4" strokeWidth={1.5} />
        </span>
        <p className="mt-4 text-sm font-semibold">
          {isReady ? label : "Wunschliste wird geladen"}
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Ihre gespeicherten Lieblingsstücke sind jederzeit für Sie da.
        </p>
        <Link
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
          href="/wunschliste"
        >
          Wunschliste öffnen{" "}
          <ArrowUpRight
            aria-hidden="true"
            className="size-3.5"
            strokeWidth={1.5}
          />
        </Link>
      </div>
    </section>
  );
}
