import { ArrowRight } from "lucide-react";
import Image from "next/image";

import type { CmsSlotComponentProps } from "@/components/cms/cms-page-renderer";
import { parseCmsCategoryRailData } from "@/lib/cms/contracts/category-rail";

export function CmsCategoryRail({ slot }: CmsSlotComponentProps) {
  const data = parseCmsCategoryRailData(slot.data);

  if (!data) {
    return null;
  }

  const { categories, description, eyebrow, title, viewAll } = data;

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
          <a
            className="group hidden shrink-0 items-center gap-2 text-sm font-semibold underline underline-offset-4 transition-colors hover:text-primary sm:inline-flex"
            href={viewAll.url}
          >
            {viewAll.label}
            <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
          </a>
        )}
      </div>

      <nav aria-label={title}>
        <ul className="-mx-4 -my-6 grid snap-x snap-mandatory scroll-px-4 auto-cols-[8.5rem] grid-flow-col gap-4 overflow-x-auto overscroll-x-contain px-4 py-6 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:auto-cols-[10rem] sm:gap-5 sm:px-8 lg:mx-0 lg:scroll-px-0 lg:auto-cols-[calc((100%-6.25rem)/6)] lg:px-0 [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => (
            <li className="snap-start" key={category.id}>
              <a
                className="group block rounded-2xl text-center focus-visible:ring-3 focus-visible:ring-primary/25 focus-visible:ring-offset-4 focus-visible:outline-none motion-safe:transition-transform motion-safe:ease-out motion-safe:hover:-translate-y-1"
                href={category.url}
              >
                <span className="relative block aspect-square overflow-hidden rounded-full border border-foreground/10 bg-muted shadow-[0_6px_18px_-10px_rgba(139,96,63,0.24)] transition-[border-color,box-shadow] group-hover:border-primary/35 group-hover:shadow-[0_18px_36px_-12px_rgba(139,96,63,0.45)]">
                  <Image
                    alt={category.image.alt}
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.05]"
                    fill
                    sizes="(max-width: 640px) 136px, (max-width: 1024px) 160px, 220px"
                    src={category.image.url}
                  />
                </span>
                <strong className="mt-3 block text-sm leading-tight font-semibold tracking-[-0.02em] sm:text-base">
                  {category.label}
                </strong>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {viewAll && (
        <a
          className="mt-6 flex h-11 items-center justify-center gap-2 rounded-xl border border-foreground text-sm font-semibold transition-colors hover:bg-foreground hover:text-background sm:hidden"
          href={viewAll.url}
        >
          {viewAll.label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      )}
    </section>
  );
}
