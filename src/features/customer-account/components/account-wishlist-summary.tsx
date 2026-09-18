"use client";

import { ArrowRight, Heart } from "lucide-react";
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
        className="text-xl font-semibold tracking-[-0.03em]"
        id="wishlist-title"
      >
        Wunschliste
      </h2>
      <div className="mt-4 rounded-2xl border border-border bg-card p-5">
        <Heart aria-hidden="true" className="size-5 text-primary" />
        <p className="mt-5 text-sm font-semibold">
          {isReady ? label : "Wunschliste wird geladen"}
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Ihre gespeicherten Lieblingsstücke sind jederzeit für Sie da.
        </p>
        <Link
          className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
          href="/wunschliste"
        >
          Wunschliste öffnen{" "}
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
