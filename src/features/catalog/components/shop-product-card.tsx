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
    <article className="group flex min-w-0 flex-col">
      <a
        className="relative block aspect-square overflow-hidden rounded-xl bg-muted/60 transition-colors duration-300 group-hover:bg-muted sm:rounded-2xl"
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
          <span className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-md bg-foreground px-2.5 py-1.5 text-[0.625rem] font-semibold tracking-wide text-background uppercase shadow-sm">
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-3 right-3 rounded-md bg-primary px-2.5 py-1.5 text-[0.625rem] font-bold text-primary-foreground shadow-sm">
            −{discount}%
          </span>
        )}
      </a>

      <div className="flex flex-1 flex-col pt-3">
        <p className="flex h-6 min-w-0 items-baseline gap-2">
          <strong className="shrink-0 text-base leading-none font-semibold tracking-[-0.025em] sm:text-lg">
            {priceFormatter.format(product.unitPrice)}
          </strong>
          {product.previousPrice && (
            <del className="truncate text-xs leading-none text-muted-foreground sm:text-sm">
              {priceFormatter.format(product.previousPrice)}
            </del>
          )}
        </p>

        <h2 className="mt-1 line-clamp-2 h-10 text-sm leading-5 font-medium tracking-[-0.01em] sm:text-base">
          <a
            className="transition-colors hover:text-primary"
            href={product.url}
            title={product.name}
          >
            {product.name}
          </a>
        </h2>
        <p
          className="mt-1 h-5 truncate text-xs leading-5 text-muted-foreground"
          title={product.company}
        >
          {product.company}
        </p>

        <p
          className="mt-1 line-clamp-2 h-10 text-xs leading-5 text-muted-foreground"
          title={product.description}
        >
          {product.description}
        </p>

        <div className="mt-2 flex h-5 min-w-0 items-center justify-between gap-2">
          <div
            aria-label={
              product.colors.length > 0
                ? `Available colours: ${product.colors.map((color) => color.label).join(", ")}`
                : undefined
            }
            className="flex min-w-0 items-center gap-1.5"
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
