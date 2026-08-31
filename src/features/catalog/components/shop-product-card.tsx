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
    <article className="group min-w-0 transition-transform duration-300 motion-safe:hover:-translate-y-1.5">
      <a
        className="relative block aspect-[0.84] overflow-hidden rounded-2xl bg-muted shadow-[0_0_0_1px_rgba(21,21,19,0.04)]"
        href={product.url}
      >
        <Image
          alt={product.image.alt}
          className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.035]"
          fill
          loading={eagerImage ? "eager" : "lazy"}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          src={product.image.url}
        />
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

      <div className="px-1 pt-4">
        {product.rating !== undefined && (
          <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Star className="size-3.5 fill-primary text-primary" />
            <span className="font-semibold text-foreground">
              {product.rating.toFixed(1)}
            </span>
            {product.reviewCount !== undefined && (
              <span>({product.reviewCount})</span>
            )}
          </p>
        )}
        <h2 className="text-sm font-semibold tracking-[-0.02em] sm:text-base">
          <a
            className="transition-colors hover:text-primary"
            href={product.url}
          >
            {product.name}
          </a>
        </h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {product.description}
        </p>

        <div
          aria-label={`Available colours: ${product.colors.map((color) => color.label).join(", ")}`}
          className="mt-3 flex min-h-4 items-center gap-1.5"
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

        <p className="mt-3 flex flex-wrap items-center gap-2">
          <strong className="text-base font-semibold sm:text-lg">
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
