import { ArrowUpRight, Star } from "lucide-react";
import Image from "next/image";

import type { ShopProduct } from "@/features/catalog/model/product-listing";
import { WishlistToggleButton } from "@/features/wishlist/components/wishlist-toggle-button";

export type ProductCardProduct = Pick<
  ShopProduct,
  "id" | "image" | "name" | "unitPrice" | "url"
> &
  Partial<
    Pick<
      ShopProduct,
      | "badge"
      | "colors"
      | "company"
      | "previousPrice"
      | "rating"
      | "reviewCount"
    >
  >;

export type ShopProductCardProps = {
  currency: string;
  eagerImage?: boolean;
  headingLevel?: "h2" | "h3";
  locale: string;
  product: ProductCardProduct;
};

export function ShopProductCard({
  currency,
  eagerImage = false,
  headingLevel = "h2",
  locale,
  product,
}: ShopProductCardProps) {
  const priceFormatter = new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  });
  const discount =
    product.previousPrice && product.previousPrice > product.unitPrice
      ? Math.round((1 - product.unitPrice / product.previousPrice) * 100)
      : undefined;
  const colors = product.colors ?? [];
  const Heading = headingLevel;

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-[1.4rem] border border-foreground/10 bg-card shadow-[0_16px_45px_-34px_rgba(21,21,19,0.7)] transition-[border-color,box-shadow] duration-300 hover:border-foreground/20 hover:shadow-[0_24px_55px_-34px_rgba(21,21,19,0.62)]">
      <WishlistToggleButton productId={product.id} productName={product.name} />
      <a
        aria-label={product.name}
        className="relative isolate block aspect-[4/5] overflow-hidden bg-gradient-to-br from-muted/80 via-muted/40 to-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        href={product.url}
      >
        <span
          aria-hidden="true"
          className="absolute -top-1/4 -right-1/3 size-4/5 rounded-full bg-background/80 opacity-70 blur-3xl transition-[transform,opacity] duration-500 group-hover:opacity-100 motion-safe:group-hover:scale-125"
        />
        <span className="absolute inset-4 sm:inset-5">
          <Image
            alt={product.image.alt}
            className="object-contain drop-shadow-[0_18px_18px_rgba(21,21,19,0.13)] transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.035]"
            fill
            loading={eagerImage ? "eager" : "lazy"}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            src={product.image.url}
            unoptimized={product.image.url.startsWith("http")}
          />
        </span>
        {product.badge && (
          <span className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full border border-white/60 bg-background/90 px-2.5 py-1.5 text-[0.625rem] font-semibold tracking-[0.08em] text-foreground uppercase shadow-sm backdrop-blur-md sm:top-4 sm:left-4">
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-14 right-3 rounded-full bg-primary px-2.5 py-1.5 text-[0.625rem] font-bold text-primary-foreground shadow-sm sm:top-15 sm:right-4">
            −{discount}%
          </span>
        )}
      </a>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="mb-2 flex min-h-4 items-center justify-between gap-2">
          <p
            className="truncate text-[0.625rem] leading-4 font-semibold tracking-[0.12em] text-muted-foreground uppercase"
            title={product.company}
          >
            {product.company}
          </p>

          {product.rating !== undefined && (
            <span className="flex shrink-0 items-center gap-1 text-[0.6875rem] text-foreground">
              <Star className="size-3.5 fill-primary text-primary" />
              <span className="font-semibold">{product.rating.toFixed(1)}</span>
              {product.reviewCount !== undefined && (
                <span className="hidden text-muted-foreground sm:inline">
                  ({product.reviewCount})
                </span>
              )}
            </span>
          )}
        </div>

        <Heading className="line-clamp-2 min-h-10 text-sm leading-5 font-semibold tracking-[-0.02em] sm:text-base">
          <a
            className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            href={product.url}
            title={product.name}
          >
            {product.name}
          </a>
        </Heading>

        <p className="mt-3 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
          <strong className="shrink-0 text-xl leading-none font-semibold tracking-[-0.035em]">
            {priceFormatter.format(product.unitPrice)}
          </strong>
          {product.previousPrice && (
            <del className="truncate text-xs leading-none text-muted-foreground sm:text-sm">
              {priceFormatter.format(product.previousPrice)}
            </del>
          )}
        </p>

        <div className="mt-auto flex min-h-9 min-w-0 items-center justify-between gap-2 border-t border-foreground/8 pt-3">
          <div
            aria-label={
              colors.length > 0
                ? `Verfügbare Farben: ${colors.map((color) => color.label).join(", ")}`
                : undefined
            }
            className="flex min-w-0 items-center gap-1.5"
          >
            {colors.slice(0, 3).map((color) => (
              <span
                aria-hidden="true"
                className="size-4 rounded-full border-2 border-background shadow-[0_0_0_1px_rgba(21,21,19,0.18)]"
                key={color.value}
                style={{ backgroundColor: color.hex }}
                title={color.label}
              />
            ))}
            {colors.length > 3 && (
              <span className="ml-0.5 text-[0.6875rem] font-medium text-muted-foreground">
                +{colors.length - 3}
              </span>
            )}
            {colors.length === 0 && (
              <span className="text-[0.6875rem] font-medium text-muted-foreground">
                Produktdetails
              </span>
            )}
          </div>

          <a
            aria-label={`Produkt ansehen: ${product.name}`}
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_18px_-10px_rgba(255,79,34,0.85)] transition-colors duration-300 group-hover:bg-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            href={product.url}
          >
            <ArrowUpRight className="size-4 transition-transform duration-300 motion-safe:group-hover:rotate-45" />
          </a>
        </div>
      </div>
    </article>
  );
}
