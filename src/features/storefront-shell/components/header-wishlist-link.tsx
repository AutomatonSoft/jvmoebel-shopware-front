"use client";

import { Heart } from "lucide-react";
import Link from "next/link";

import { useWishlist } from "@/features/wishlist/hooks/use-wishlist";

export function HeaderWishlistLink() {
  const { isReady, productIds } = useWishlist();
  const productCount = productIds.length;
  const showCount = isReady && productCount > 0;
  const label = showCount
    ? `Wunschliste, ${productCount} ${productCount === 1 ? "Artikel" : "Artikel"}`
    : "Wunschliste";

  return (
    <Link
      aria-label={label}
      className="relative hidden size-10 items-center justify-center rounded-full transition-[background,transform,box-shadow,color] hover:bg-muted hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:active:scale-90 sm:flex"
      href="/wunschliste"
    >
      <Heart className="size-4.5" />
      {showCount && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[0.5625rem] leading-4 font-bold text-primary-foreground"
        >
          {productCount > 99 ? "99+" : productCount}
        </span>
      )}
    </Link>
  );
}
