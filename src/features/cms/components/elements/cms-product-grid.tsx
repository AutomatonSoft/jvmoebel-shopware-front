import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";

import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsProductGridData } from "@/features/cms/contracts/product-grid";
import {
  reportCmsContractIssues,
  reportCmsRenderingIssue,
} from "@/features/cms/server/report-rendering-issue";
import { cn } from "@/lib/utils";

export function CmsProductGrid({ slot }: CmsSlotComponentProps) {
  const result = parseCmsProductGridData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const data = result.data;
  const {
    anchorId,
    currency,
    eyebrow,
    layout,
    locale,
    products,
    title,
    viewAll,
  } = data;

  let priceFormatter: Intl.NumberFormat;

  try {
    priceFormatter = new Intl.NumberFormat(locale, {
      currency,
      maximumFractionDigits: 0,
      style: "currency",
    });
  } catch (error) {
    reportCmsRenderingIssue({
      cause:
        error instanceof Error
          ? error.message
          : "Unknown currency formatter error.",
      code: "rendering-failed",
      message: "Unable to create the product price formatter.",
      slot,
    });

    return null;
  }

  return (
    <section
      className={cn(
        layout === "grid"
          ? "mx-2 overflow-hidden rounded-3xl bg-muted sm:mx-6"
          : "mx-auto w-full max-w-360 px-4 sm:px-8",
      )}
      data-cms-element="jv-product-grid"
      id={anchorId}
    >
      <div
        className={cn(
          layout === "grid"
            ? "mx-auto w-full max-w-360 px-4 py-20 sm:px-8 sm:py-28"
            : "py-16 sm:py-20",
        )}
      >
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
          {viewAll && (
            <CmsLink
              className="group hidden items-center gap-2 text-sm font-semibold underline underline-offset-4 transition-colors hover:text-primary sm:inline-flex"
              href={viewAll.url}
            >
              {viewAll.label}
              <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
            </CmsLink>
          )}
        </div>

        <div
          className={cn(
            layout === "grid"
              ? "grid grid-cols-2 gap-x-3 gap-y-9 lg:grid-cols-4 lg:gap-x-4"
              : "grid grid-flow-col auto-cols-[minmax(15rem,18rem)] gap-3 overflow-x-auto pb-4 sm:gap-4",
          )}
        >
          {products.map((product) => {
            const discount =
              product.previousPrice && product.previousPrice > product.unitPrice
                ? Math.round(
                    (1 - product.unitPrice / product.previousPrice) * 100,
                  )
                : undefined;

            return (
              <article
                className="group flex min-w-0 flex-col rounded-2xl border border-foreground/10 bg-background p-2 shadow-[0_10px_30px_-24px_rgba(21,21,19,0.55)] transition-[transform,border-color,box-shadow] duration-300 hover:border-foreground/20 hover:shadow-[0_22px_48px_-28px_rgba(21,21,19,0.6)] motion-safe:hover:-translate-y-1"
                key={product.id}
              >
                <CmsLink
                  className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-muted/45 ring-1 ring-foreground/5 transition-colors duration-300 group-hover:bg-muted/70"
                  href={product.url}
                >
                  <span className="absolute inset-2 sm:inset-3">
                    <Image
                      alt={product.image.alt}
                      className="object-contain"
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      src={product.image.url}
                    />
                  </span>
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
                </CmsLink>

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
                  <h3 className="text-sm leading-5 font-medium tracking-[-0.01em] sm:text-base">
                    <CmsLink className="hover:text-primary" href={product.url}>
                      {product.name}
                    </CmsLink>
                  </h3>
                  {product.description && (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {product.description}
                    </p>
                  )}
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
          })}
        </div>

        {viewAll && (
          <CmsLink
            className="mt-10 flex h-11 items-center justify-center gap-2 rounded-xl border border-foreground text-sm font-semibold transition-colors hover:bg-foreground hover:text-background sm:hidden"
            href={viewAll.url}
          >
            {viewAll.label}
            <ArrowRight className="size-4" />
          </CmsLink>
        )}
      </div>
    </section>
  );
}
