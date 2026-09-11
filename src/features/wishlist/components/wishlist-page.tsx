"use client";

import { Heart, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ShopProductCard } from "@/features/catalog/components/shop-product-card";
import type { ShopProductListing } from "@/features/catalog/model/product-listing";
import { useWishlist } from "@/features/wishlist/hooks/use-wishlist";

type WishlistPageProps = Readonly<{
  listing: ShopProductListing;
}>;

export function WishlistPage({ listing }: WishlistPageProps) {
  const { isReady, productIds } = useWishlist();
  const productsById = new Map(
    listing.products.map((product) => [product.id, product]),
  );
  const products = productIds.flatMap((productId) => {
    const product = productsById.get(productId);

    return product ? [product] : [];
  });
  const productCountLabel =
    products.length === 1
      ? "1 Lieblingsstück"
      : `${products.length} Lieblingsstücke`;

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-360 px-4 py-8 sm:px-8 sm:py-12">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Link className="transition-colors hover:text-primary" href="/">
            Startseite
          </Link>
          <span aria-hidden="true">/</span>
          <strong className="font-medium text-foreground">Wunschliste</strong>
        </nav>

        <header className="mt-8 flex flex-col gap-4 border-b border-border/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.15em] text-primary uppercase">
              <Heart aria-hidden="true" className="size-4 fill-primary" />
              Ihre Auswahl
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Meine Wunschliste
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Sammeln Sie Ihre Möbel-Favoriten an einem Ort und vergleichen Sie
              sie in Ruhe.
            </p>
          </div>
          {isReady && products.length > 0 && (
            <p className="w-fit rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
              {productCountLabel}
            </p>
          )}
        </header>

        {!isReady ? (
          <div
            aria-label="Wunschliste wird geladen"
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
            role="status"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <span
                aria-hidden="true"
                className="aspect-[4/5] animate-pulse rounded-3xl bg-muted"
                key={index}
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <section aria-label={productCountLabel} className="mt-8">
            <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-3 md:gap-x-4 xl:grid-cols-4">
              {products.map((product, index) => (
                <ShopProductCard
                  currency={listing.currency}
                  eagerImage={index < 4}
                  key={product.id}
                  locale={listing.locale}
                  product={product}
                />
              ))}
            </div>

            <p className="mt-10 flex items-start gap-2 border-t border-border/80 pt-5 text-xs leading-5 text-muted-foreground">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              Ihre Wunschliste wird in diesem Browser gespeichert und ist ohne
              Anmeldung verfügbar.
            </p>
          </section>
        ) : (
          <section className="mt-8 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center sm:py-24">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-muted text-primary">
              <Heart aria-hidden="true" className="size-7" />
            </span>
            <p className="mt-6 text-[0.6875rem] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
              Noch keine Favoriten
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
              Ihre Wunschliste ist noch leer
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Tippen Sie bei einem Produkt auf das Herz, um es hier für später
              zu speichern.
            </p>
            <Button
              className="mt-7"
              nativeButton={false}
              render={<Link href="/moebel-sortiment" />}
              size="lg"
            >
              <Sparkles aria-hidden="true" />
              Möbel entdecken
            </Button>
          </section>
        )}
      </div>
    </main>
  );
}
