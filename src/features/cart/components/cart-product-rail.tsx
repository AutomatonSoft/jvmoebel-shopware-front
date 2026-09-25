"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { ShopProductCard } from "@/features/catalog/components/shop-product-card";
import { useProductRail } from "@/features/catalog/hooks/use-product-rail";
import { useRecentlyViewedProducts } from "@/features/catalog/hooks/use-recently-viewed-products";
import type {
  ShopProduct,
  ShopProductListing,
} from "@/features/catalog/model/product-listing";

type ProductRailProps = Readonly<{
  currency: string;
  locale: string;
  products: readonly ShopProduct[];
  title: string;
}>;

function ProductRail({ currency, locale, products, title }: ProductRailProps) {
  const { canScrollBack, canScrollForward, railRef, scrollRail } =
    useProductRail(products.length);

  if (products.length === 0) return null;

  return (
    <section aria-labelledby={`${title}-title`} className="mt-12 sm:mt-16">
      <div className="mb-5 flex items-center justify-between gap-4 sm:mb-7">
        <h2
          className="text-xl font-semibold tracking-[-0.035em] sm:text-2xl"
          id={`${title}-title`}
        >
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button
            aria-label={`${title}: vorherige Produkte`}
            className="grid size-10 place-items-center rounded-full border bg-card transition-colors hover:bg-secondary disabled:cursor-default disabled:opacity-35"
            disabled={!canScrollBack}
            onClick={() => scrollRail(-1)}
            type="button"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            aria-label={`${title}: weitere Produkte`}
            className="grid size-10 place-items-center rounded-full border bg-card transition-colors hover:bg-secondary disabled:cursor-default disabled:opacity-35"
            disabled={!canScrollForward}
            onClick={() => scrollRail(1)}
            type="button"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
      <ul
        className="-mx-4 grid snap-x snap-mandatory scroll-px-4 auto-cols-[minmax(13rem,72vw)] grid-flow-col gap-3 overflow-x-auto overscroll-x-contain px-4 pb-4 scrollbar-none sm:-mx-8 sm:scroll-px-8 sm:auto-cols-[minmax(15rem,18rem)] sm:gap-4 sm:px-8 lg:mx-0 lg:scroll-px-0 lg:auto-cols-[calc((100%-5rem)/6)] lg:px-0 [&::-webkit-scrollbar]:hidden"
        ref={railRef}
      >
        {products.map((product, index) => (
          <li className="snap-start" key={product.id}>
            <ShopProductCard
              currency={currency}
              eagerImage={index < 3}
              headingLevel="h3"
              locale={locale}
              product={product}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CartProductRails({
  recommendations,
}: Readonly<{ recommendations: ShopProductListing }>) {
  const recentlyViewedListing = useRecentlyViewedProducts();

  return (
    <div className="border-t border-border/80 pt-1">
      <ProductRail
        currency={recentlyViewedListing?.currency ?? recommendations.currency}
        locale={recentlyViewedListing?.locale ?? recommendations.locale}
        products={recentlyViewedListing?.products ?? []}
        title="Zuletzt angesehene Produkte"
      />
      <ProductRail
        currency={recommendations.currency}
        locale={recommendations.locale}
        products={recommendations.products}
        title="Das könnte dir auch gefallen"
      />
    </div>
  );
}
