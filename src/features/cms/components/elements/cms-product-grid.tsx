import { ArrowRight } from "lucide-react";

import { ShopProductCard } from "@/features/catalog/components/shop-product-card";
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

  try {
    new Intl.NumberFormat(locale, {
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
          {products.map((product) => (
            <ShopProductCard
              currency={currency}
              headingLevel="h3"
              key={product.id}
              locale={locale}
              product={product}
            />
          ))}
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
