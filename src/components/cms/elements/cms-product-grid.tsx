import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";

import type { CmsSlotComponentProps } from "@/components/cms/cms-page-renderer";

function getRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

function getString(record: Record<string, unknown> | undefined, key: string) {
  const value = record?.[key];

  return typeof value === "string" && value.trim() ? value : undefined;
}

function getNumber(record: Record<string, unknown> | undefined, key: string) {
  const value = record?.[key];

  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function getProducts(data: Record<string, unknown> | undefined) {
  const productsValue = data?.products;
  const productsRecord = getRecord(productsValue);
  const productValues = Array.isArray(productsValue)
    ? productsValue
    : productsRecord
      ? Object.values(productsRecord)
      : [];

  return productValues
    .flatMap((value, index) => {
      const product = getRecord(value);
      const translated = getRecord(product?.translated);
      const cover = getRecord(product?.cover);
      const media = getRecord(cover?.media);
      const calculatedPrice = getRecord(product?.calculatedPrice);
      const listPrice = getRecord(calculatedPrice?.listPrice);
      const id = getString(product, "id");
      const name = getString(translated, "name") || getString(product, "name");
      const url = getString(product, "url");
      const imageUrl = getString(media, "url");
      const unitPrice = getNumber(calculatedPrice, "unitPrice");

      if (!id || !name || !url || !imageUrl || unitPrice === undefined) {
        return [];
      }

      const previousPrice = getNumber(listPrice, "price");

      return [
        {
          badge: getString(product, "badge"),
          description:
            getString(translated, "description") ||
            getString(product, "description"),
          id,
          imageAlt: getString(media, "alt") || name,
          imageUrl,
          name,
          position:
            typeof product?.position === "number" ? product.position : index,
          previousPrice,
          rating: getNumber(product, "ratingAverage"),
          reviewCount: getNumber(product, "reviewCount"),
          unitPrice,
          url,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);
}

export function CmsProductGrid({ slot }: CmsSlotComponentProps) {
  const data = getRecord(slot.data);
  const products = getProducts(data);
  const title = getString(data, "title");
  const locale = getString(data, "locale");
  const currency = getString(data, "currency");

  if (!title || !locale || !currency || products.length === 0) {
    return null;
  }

  let priceFormatter: Intl.NumberFormat;

  try {
    priceFormatter = new Intl.NumberFormat(locale, {
      currency,
      maximumFractionDigits: 0,
      style: "currency",
    });
  } catch {
    return null;
  }

  const eyebrow = getString(data, "eyebrow");
  const viewAll = getRecord(data?.viewAll);
  const viewAllLabel = getString(viewAll, "label");
  const viewAllUrl = getString(viewAll, "url");

  return (
    <section
      className="mx-2 overflow-hidden rounded-3xl bg-muted sm:mx-6"
      data-cms-element="jv-product-grid"
    >
      <div className="mx-auto w-full max-w-360 px-4 py-20 sm:px-8 sm:py-28">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            {eyebrow && (
              <p className="mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] uppercase before:block before:size-2 before:bg-primary">
                {eyebrow}
              </p>
            )}
            <h2 className="text-4xl leading-none font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
              {title}
            </h2>
          </div>
          {viewAllLabel && viewAllUrl && (
            <a
              className="group hidden items-center gap-2 text-sm font-semibold underline underline-offset-4 transition-colors hover:text-primary sm:inline-flex"
              href={viewAllUrl}
            >
              {viewAllLabel}
              <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-9 lg:grid-cols-4 lg:gap-x-4">
          {products.map((product) => {
            const discount =
              product.previousPrice && product.previousPrice > product.unitPrice
                ? Math.round(
                    (1 - product.unitPrice / product.previousPrice) * 100,
                  )
                : undefined;

            return (
              <article
                className="group min-w-0 transition-transform duration-300 motion-safe:hover:-translate-y-1.5"
                key={product.id}
              >
                <a
                  className="relative block aspect-[0.84] overflow-hidden rounded-2xl bg-background shadow-[0_0_0_1px_rgba(21,21,19,0.04)]"
                  href={product.url}
                >
                  <Image
                    alt={product.imageAlt}
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.035]"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    src={product.imageUrl}
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-[0.625rem] font-semibold tracking-wide text-foreground uppercase backdrop-blur">
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
                  <h3 className="text-sm font-semibold tracking-[-0.02em] sm:text-base">
                    <a className="hover:text-primary" href={product.url}>
                      {product.name}
                    </a>
                  </h3>
                  {product.description && (
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {product.description}
                    </p>
                  )}
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
          })}
        </div>

        {viewAllLabel && viewAllUrl && (
          <a
            className="mt-10 flex h-11 items-center justify-center gap-2 rounded-xl border border-foreground text-sm font-semibold transition-colors hover:bg-foreground hover:text-background sm:hidden"
            href={viewAllUrl}
          >
            {viewAllLabel}
            <ArrowRight className="size-4" />
          </a>
        )}
      </div>
    </section>
  );
}
