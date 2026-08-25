import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ShopProductCard } from "@/components/storefront/shop-product-card";
import type { ShopProduct } from "@/lib/shopware/product-listing";

export type ProductRecommendationsProps = {
  currency: string;
  locale: string;
  products: readonly ShopProduct[];
};

export function ProductRecommendations({
  currency,
  locale,
  products,
}: ProductRecommendationsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="product-recommendations-title"
      className="border-t py-16 sm:py-20"
    >
      <div className="mb-9 flex items-end justify-between gap-6 sm:mb-11">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            Similar products
          </p>
          <h2
            className="mt-4 text-3xl leading-tight font-semibold tracking-[-0.04em] text-balance sm:text-4xl"
            id="product-recommendations-title"
          >
            You may also like.
          </h2>
        </div>

        <Link
          className="group hidden items-center gap-2 text-sm font-semibold underline underline-offset-4 transition-colors hover:text-primary sm:inline-flex"
          href="/shop"
        >
          Shop all products
          <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-3 md:gap-x-4">
        {products.map((product) => (
          <ShopProductCard
            currency={currency}
            key={product.id}
            locale={locale}
            product={product}
          />
        ))}
      </div>

      <Link
        className="mt-10 flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors hover:bg-foreground hover:text-background sm:hidden"
        href="/shop"
      >
        Shop all products
        <ArrowRight className="size-4" />
      </Link>
    </section>
  );
}
