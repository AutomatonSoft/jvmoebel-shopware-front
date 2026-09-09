import { Star } from "lucide-react";
import Image from "next/image";

import type { ShopProduct } from "@/features/catalog/model/product-listing";

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
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-[0_10px_30px_-26px_rgba(21,21,19,0.5)] transition-[transform,border-color,box-shadow] duration-300 hover:border-foreground/20 hover:shadow-[0_22px_48px_-30px_rgba(21,21,19,0.55)] motion-safe:hover:-translate-y-0.5">
      <a
        className="relative block aspect-[4/5] overflow-hidden bg-muted/50 transition-colors duration-300 group-hover:bg-muted/75"
        href={product.url}
      >
        <span className="absolute inset-3 sm:inset-4">
          <Image
            alt={product.image.alt}
            className="object-contain transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.035]"
            fill
            loading={eagerImage ? "eager" : "lazy"}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            src={product.image.url}
            unoptimized={product.image.url.startsWith("http")}
          />
        </span>
        {product.badge && (
          <span className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-background/92 px-2.5 py-1.5 text-[0.625rem] font-semibold tracking-wide text-foreground uppercase shadow-sm backdrop-blur-sm">
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-3 right-3 rounded-full bg-primary px-2.5 py-1.5 text-[0.625rem] font-bold text-primary-foreground shadow-sm">
            −{discount}%
          </span>
        )}
      </a>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p
          className="mb-1 min-h-4 truncate text-[0.625rem] leading-4 font-semibold tracking-[0.1em] text-muted-foreground uppercase"
          title={product.company}
        >
          {product.company}
        </p>

        <Heading className="line-clamp-2 min-h-10 text-sm leading-5 font-medium tracking-[-0.01em] sm:text-base">
          <a
            className="transition-colors hover:text-primary"
            href={product.url}
            title={product.name}
          >
            {product.name}
          </a>
        </Heading>

        <p className="mt-3 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
          <strong className="shrink-0 text-lg leading-none font-semibold tracking-[-0.025em]">
            {priceFormatter.format(product.unitPrice)}
          </strong>
          {product.previousPrice && (
            <del className="truncate text-xs leading-none text-muted-foreground sm:text-sm">
              {priceFormatter.format(product.previousPrice)}
            </del>
          )}
        </p>

        <div className="mt-auto flex min-h-5 min-w-0 items-center justify-between gap-2 pt-3">
          <div
            aria-label={
              colors.length > 0
                ? `Available colours: ${colors.map((color) => color.label).join(", ")}`
                : undefined
            }
            className="flex min-w-0 items-center gap-1.5"
          >
            {colors.slice(0, 3).map((color) => (
              <span
                aria-hidden="true"
                className="size-4 rounded-full border border-foreground/20"
                key={color.value}
                style={{ backgroundColor: color.hex }}
                title={color.label}
              />
            ))}
            {colors.length > 3 && (
              <span className="ml-1 text-xs text-muted-foreground">
                +{colors.length - 3}
              </span>
            )}
          </div>

          {product.rating !== undefined && (
            <span className="flex shrink-0 items-center gap-1 text-xs text-foreground">
              <Star className="size-3.5 fill-primary text-primary" />
              <span className="font-semibold">{product.rating.toFixed(1)}</span>
              {product.reviewCount !== undefined && (
                <span className="text-muted-foreground">
                  ({product.reviewCount})
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
