import { Star } from "lucide-react";
import Image from "next/image";

import type { ShopProduct } from "@/features/catalog/model/product-listing";

export type ShopProductCardProps = {
  currency: string;
  eagerImage?: boolean;
  locale: string;
  product: ShopProduct;
};

export function ShopProductCard({
  currency,
  eagerImage = false,
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

  return (
    <article className="group flex min-w-0 flex-col rounded-2xl border border-foreground/10 bg-card p-2 shadow-[0_10px_30px_-24px_rgba(21,21,19,0.55)] transition-[transform,border-color,box-shadow] duration-300 hover:border-foreground/20 hover:shadow-[0_22px_48px_-28px_rgba(21,21,19,0.6)] motion-safe:hover:-translate-y-1">
      <a
        className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-muted/60 ring-1 ring-foreground/5 transition-colors duration-300 group-hover:bg-muted"
        href={product.url}
      >
        <span className="absolute inset-2 sm:inset-3">
          <Image
            alt={product.image.alt}
            className="object-contain"
            fill
            loading={eagerImage ? "eager" : "lazy"}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            src={product.image.url}
            unoptimized={product.image.url.startsWith("http")}
          />
        </span>
        {product.badge && (
          <span className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-white/90 px-3 py-1.5 text-[0.625rem] font-semibold tracking-wide text-foreground uppercase backdrop-blur">
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-3 right-3 rounded-full bg-primary px-2.5 py-1.5 text-[0.625rem] font-bold text-primary-foreground">
            −{discount}%
          </span>
        )}
      </a>

      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        {product.rating !== undefined && (
          <p className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Star className="size-3.5 fill-primary text-primary" />
            <span className="font-semibold text-foreground">
              {product.rating.toFixed(1)}
            </span>
            {product.reviewCount !== undefined && (
              <span>({product.reviewCount})</span>
            )}
          </p>
        )}
        <h2 className="text-sm leading-5 font-medium tracking-[-0.01em] sm:text-base">
          <a
            className="transition-colors hover:text-primary"
            href={product.url}
          >
            {product.name}
          </a>
        </h2>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {product.description}
        </p>

        <div
          aria-label={`Available colours: ${product.colors.map((color) => color.label).join(", ")}`}
          className="mt-2.5 flex min-h-4 items-center gap-1.5"
        >
          {product.colors.slice(0, 3).map((color) => (
            <span
              aria-hidden="true"
              className="size-4 rounded-full border border-foreground/20"
              key={color.value}
              style={{ backgroundColor: color.hex }}
              title={color.label}
            />
          ))}
          {product.colors.length > 3 && (
            <span className="ml-1 text-xs text-muted-foreground">
              +{product.colors.length - 3}
            </span>
          )}
        </div>

        <p className="mt-auto flex flex-wrap items-baseline gap-2 pt-3">
          <strong className="text-base font-semibold tracking-[-0.02em] sm:text-lg">
            {priceFormatter.format(product.unitPrice)}
          </strong>
          {product.previousPrice && (
            <del className="text-xs text-muted-foreground sm:text-sm">
              {priceFormatter.format(product.previousPrice)}
            </del>
          )}
        </p>
      </div>
    </article>
  );
}
