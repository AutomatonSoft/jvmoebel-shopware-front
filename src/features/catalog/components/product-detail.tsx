import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProductGallery } from "@/features/catalog/components/product-gallery";
import { ProductPurchasePanel } from "@/features/catalog/components/product-purchase-panel";
import { ProductSpecifications } from "@/features/catalog/components/product-specifications";
import { ShopProductCard } from "@/features/catalog/components/shop-product-card";
import type { ShopProductPageData } from "@/features/catalog/model/product-detail";

export type ProductDetailProps = ShopProductPageData;

export function ProductDetail({
  currency,
  locale,
  product,
  relatedProducts,
}: ProductDetailProps) {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-360 px-4 py-6 sm:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2.5 text-[0.625rem] text-muted-foreground"
        >
          <Link className="transition-colors hover:text-primary" href="/">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            className="transition-colors hover:text-primary"
            href="/moebel-sortiment"
          >
            Shop
          </Link>
          <span aria-hidden="true">/</span>
          <strong className="font-medium text-foreground">
            {product.name}
          </strong>
        </nav>

        <section className="grid gap-8 py-8 sm:py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(32rem,1.1fr)] lg:items-start lg:gap-10 xl:gap-12">
          <div className="lg:sticky lg:top-24">
            <ProductGallery badge={product.badge} images={product.gallery} />
          </div>

          <ProductPurchasePanel
            currency={currency}
            locale={locale}
            product={product}
          />
        </section>

        <ProductSpecifications product={product} />

        {relatedProducts.length > 0 && (
          <section
            aria-labelledby="product-recommendations-title"
            className="border-t py-16 sm:py-20"
          >
            <div className="mb-9 flex items-end justify-between gap-6 sm:mb-11">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                  Ähnliche Produkte
                </p>
                <h2
                  className="mt-4 text-3xl leading-tight font-semibold tracking-[-0.04em] text-balance sm:text-4xl"
                  id="product-recommendations-title"
                >
                  Das könnte Ihnen auch gefallen.
                </h2>
              </div>

              <Link
                className="group hidden items-center gap-2 text-sm font-semibold underline underline-offset-4 transition-colors hover:text-primary sm:inline-flex"
                href="/moebel-sortiment"
              >
                Alle Produkte
                <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-3 md:gap-x-4 lg:grid-cols-4 xl:grid-cols-5">
              {relatedProducts.map((relatedProduct) => (
                <ShopProductCard
                  currency={currency}
                  key={relatedProduct.id}
                  locale={locale}
                  product={relatedProduct}
                />
              ))}
            </div>

            <Link
              className="mt-10 flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors hover:bg-foreground hover:text-background sm:hidden"
              href="/moebel-sortiment"
            >
              Alle Produkte
              <ArrowRight className="size-4" />
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
