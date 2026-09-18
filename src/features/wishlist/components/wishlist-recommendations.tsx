"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ShopProductCard } from "@/features/catalog/components/shop-product-card";
import type { ShopProductListing } from "@/features/catalog/model/product-listing";

type ScrollState = Readonly<{
  canScrollBack: boolean;
  canScrollForward: boolean;
}>;

const initialScrollState: ScrollState = {
  canScrollBack: false,
  canScrollForward: false,
};

type WishlistRecommendationsProps = Readonly<{
  isLoading: boolean;
  listing?: ShopProductListing;
}>;

export function WishlistRecommendations({
  isLoading,
  listing,
}: WishlistRecommendationsProps) {
  const railRef = useRef<HTMLUListElement>(null);
  const [scrollState, setScrollState] =
    useState<ScrollState>(initialScrollState);
  const products = listing?.products ?? [];

  useEffect(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const railElement = rail;
    let animationFrame: number | null = null;

    function updateScrollState() {
      animationFrame = null;
      const maximumScrollLeft =
        railElement.scrollWidth - railElement.clientWidth;
      const canScrollBack = railElement.scrollLeft > 2;
      const canScrollForward = railElement.scrollLeft < maximumScrollLeft - 2;

      setScrollState((currentState) =>
        currentState.canScrollBack === canScrollBack &&
        currentState.canScrollForward === canScrollForward
          ? currentState
          : { canScrollBack, canScrollForward },
      );
    }

    function requestScrollStateUpdate() {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateScrollState);
      }
    }

    requestScrollStateUpdate();
    railElement.addEventListener("scroll", requestScrollStateUpdate, {
      passive: true,
    });
    window.addEventListener("resize", requestScrollStateUpdate);

    return () => {
      railElement.removeEventListener("scroll", requestScrollStateUpdate);
      window.removeEventListener("resize", requestScrollStateUpdate);

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [products.length]);

  function scrollRail(direction: -1 | 1) {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    rail.scrollBy({
      behavior: "smooth",
      left: direction * Math.max(rail.clientWidth * 0.8, 280),
    });
  }

  if (!isLoading && (!listing || products.length === 0)) {
    return null;
  }

  return (
    <section
      aria-labelledby="wishlist-recommendations-title"
      className="mt-12 border-t border-border/80 pt-10 sm:mt-16 sm:pt-12"
    >
      <div className="mb-7 flex items-end justify-between gap-5 sm:mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase">
            Neu eingetroffen
          </p>
          <h2
            className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl"
            id="wishlist-recommendations-title"
          >
            Unsere Neuheiten
          </h2>
        </div>

        {products.length > 0 && (
          <div className="hidden items-center gap-2 sm:flex">
            <button
              aria-label="Vorherige Neuheiten anzeigen"
              className="flex size-9 items-center justify-center rounded-full border bg-card transition-[background-color,border-color,color] hover:border-foreground/35 hover:bg-secondary disabled:cursor-default disabled:opacity-35"
              disabled={!scrollState.canScrollBack}
              onClick={() => scrollRail(-1)}
              type="button"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
            </button>
            <button
              aria-label="Weitere Neuheiten anzeigen"
              className="flex size-9 items-center justify-center rounded-full border bg-card transition-[background-color,border-color,color] hover:border-foreground/35 hover:bg-secondary disabled:cursor-default disabled:opacity-35"
              disabled={!scrollState.canScrollForward}
              onClick={() => scrollRail(1)}
              type="button"
            >
              <ArrowRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div
          aria-label="Neuheiten werden geladen"
          className="grid grid-flow-col auto-cols-[minmax(14rem,75vw)] gap-3 overflow-hidden sm:auto-cols-[minmax(15rem,20rem)] sm:gap-4"
          role="status"
        >
          {Array.from({ length: 3 }, (_, index) => (
            <span
              aria-hidden="true"
              className="aspect-[4/5] animate-pulse rounded-3xl bg-muted"
              key={index}
            />
          ))}
        </div>
      ) : listing ? (
        <ul
          aria-label="Unsere Neuheiten"
          className="-mx-4 grid snap-x snap-mandatory scroll-px-4 auto-cols-[minmax(14rem,75vw)] grid-flow-col gap-3 overflow-x-auto overscroll-x-contain px-4 pb-4 scrollbar-none sm:-mx-8 sm:scroll-px-8 sm:auto-cols-[minmax(15rem,20rem)] sm:gap-4 sm:px-8 lg:mx-0 lg:scroll-px-0 lg:auto-cols-[calc((100%-5rem)/6)] lg:px-0 [&::-webkit-scrollbar]:hidden"
          ref={railRef}
        >
          {products.map((product, index) => (
            <li className="snap-start" key={product.id}>
              <ShopProductCard
                currency={listing.currency}
                eagerImage={index < 3}
                headingLevel="h3"
                locale={listing.locale}
                product={product}
              />
            </li>
          ))}
        </ul>
      ) : null}

      <Link
        className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4 transition-colors hover:text-primary"
        href="/moebel-sortiment"
      >
        Alle Neuheiten ansehen
        <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
      </Link>
    </section>
  );
}
