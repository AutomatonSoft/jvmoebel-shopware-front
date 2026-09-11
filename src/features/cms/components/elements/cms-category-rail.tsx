import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsCategoryRailData } from "@/features/cms/contracts/category-rail";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";
import { cn } from "@/lib/utils";

export function CmsCategoryRail({ slot }: CmsSlotComponentProps) {
  const result = parseCmsCategoryRailData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const { categories, description, eyebrow, layout, title, viewAll } =
    result.data;

  return (
    <section
      className="mx-auto w-full max-w-360 px-4 pt-16 sm:px-8 sm:pt-20"
      data-cms-element="jv-category-rail"
    >
      <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
        <div>
          {eyebrow && (
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase before:block before:size-2 before:bg-primary">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl leading-none font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {viewAll && (
          <CmsLink
            className="group hidden shrink-0 items-center gap-2 text-sm font-semibold underline underline-offset-4 transition-colors hover:text-primary sm:inline-flex"
            href={viewAll.url}
          >
            {viewAll.label}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
            />
          </CmsLink>
        )}
      </div>

      <nav aria-label={title}>
        <ul
          className={cn(
            layout === "grid"
              ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8"
              : "-mx-4 -my-6 grid snap-x snap-mandatory scroll-px-4 auto-cols-[8.5rem] grid-flow-col gap-4 overflow-x-auto overscroll-x-contain px-4 py-6 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:auto-cols-[10rem] sm:gap-5 sm:px-8 lg:mx-0 lg:scroll-px-0 lg:auto-cols-[calc((100%-6.25rem)/6)] lg:px-0 [&::-webkit-scrollbar]:hidden",
          )}
        >
          {categories.map((category) => (
            <li
              className={cn(layout === "rail" && "snap-start")}
              key={category.id}
            >
              <CmsLink
                className={cn(
                  "group block rounded-2xl text-center focus-visible:ring-3 focus-visible:ring-primary/25 focus-visible:ring-offset-4 focus-visible:outline-none motion-safe:transition-transform motion-safe:ease-out motion-safe:hover:-translate-y-1",
                  layout === "grid" &&
                    "border bg-card p-2 shadow-[0_10px_30px_-26px_rgba(21,21,19,0.6)] hover:border-foreground/25",
                )}
                href={category.url}
              >
                <span
                  className={cn(
                    "relative block aspect-square overflow-hidden bg-muted transition-[border-color,box-shadow]",
                    layout === "grid"
                      ? "rounded-xl bg-muted/60"
                      : "rounded-full border border-foreground/10 shadow-[0_6px_18px_-10px_rgba(139,96,63,0.24)] group-hover:border-primary/35 group-hover:shadow-[0_18px_36px_-12px_rgba(139,96,63,0.45)]",
                  )}
                >
                  <Image
                    alt={category.image.alt}
                    className={cn(
                      "transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.05]",
                      layout === "grid" ? "object-contain p-2" : "object-cover",
                    )}
                    fill
                    sizes="(max-width: 640px) 136px, (max-width: 1024px) 160px, 220px"
                    src={category.image.url}
                  />
                </span>
                <strong
                  className={cn(
                    "block text-sm leading-tight font-semibold tracking-[-0.02em] sm:text-base",
                    layout === "grid" ? "min-h-12 px-1 py-3" : "mt-3",
                  )}
                >
                  {category.label}
                </strong>
              </CmsLink>
            </li>
          ))}
        </ul>
      </nav>

      {viewAll && (
        <CmsLink
          className="mt-6 flex h-11 items-center justify-center gap-2 rounded-xl border border-foreground text-sm font-semibold transition-colors hover:bg-foreground hover:text-background sm:hidden"
          href={viewAll.url}
        >
          {viewAll.label}
          <ArrowRight aria-hidden="true" className="size-4" />
        </CmsLink>
      )}
    </section>
  );
}
