import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";

import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsShopTheLookData } from "@/features/cms/contracts/shop-the-look";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

export function CmsShopTheLook({ slot }: CmsSlotComponentProps) {
  const result = parseCmsShopTheLookData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const { description, eyebrow, image, items, title, viewAll } = result.data;

  return (
    <section
      className="mx-2 mt-12 rounded-3xl bg-muted sm:mx-4 sm:mt-16 lg:mx-6"
      data-cms-element="jv-shop-the-look"
    >
      <div className="mx-auto w-full max-w-360 px-4 py-10 sm:px-8 sm:py-12 lg:py-14">
        <div className="mb-6 grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end sm:mb-8">
          <div>
            {eyebrow && (
              <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase before:block before:size-2 before:bg-primary">
                {eyebrow}
              </p>
            )}
            <h2 className="max-w-3xl text-3xl leading-none font-semibold tracking-[-0.04em] text-balance sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            {description && (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                {description}
              </p>
            )}
          </div>

          {viewAll && (
            <a
              className="group hidden shrink-0 items-center gap-2 text-sm font-semibold underline underline-offset-4 transition-colors hover:text-primary md:inline-flex"
              href={viewAll.url}
            >
              {viewAll.label}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
              />
            </a>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,0.7fr)]">
          <div className="relative min-h-80 overflow-hidden rounded-2xl bg-background shadow-[0_18px_50px_-34px_rgba(139,96,63,0.55)] sm:min-h-112 lg:min-h-136">
            <Image
              alt={image.alt}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) calc(100vw - 2rem), (max-width: 1536px) 62vw, 900px"
              src={image.url}
            />

            {items.map((item, index) => (
              <a
                aria-label={`${index + 1}. ${item.name}`}
                className="group/hotspot absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:ring-3 focus-visible:ring-primary/30 focus-visible:ring-offset-3 focus-visible:outline-none"
                href={item.url}
                key={item.id}
                style={{
                  left: `${item.hotspot.x}%`,
                  top: `${item.hotspot.y}%`,
                }}
              >
                <span className="flex size-10 items-center justify-center rounded-full border border-white/70 bg-background/95 text-xs font-bold text-foreground shadow-[0_8px_24px_-10px_rgba(91,65,43,0.65)] backdrop-blur transition-[border-color,color,transform] group-hover/hotspot:border-primary group-hover/hotspot:text-primary motion-safe:group-hover/hotspot:scale-110 sm:size-11">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </a>
            ))}
          </div>

          <ol
            aria-label={title}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:auto-rows-fr"
          >
            {items.map((item, index) => (
              <li key={item.id}>
                <a
                  className="group flex h-full min-h-24 items-center gap-4 rounded-2xl border border-foreground/10 bg-background/75 p-4 transition-[border-color,background-color,box-shadow,transform] hover:border-primary/30 hover:bg-background hover:shadow-[0_14px_30px_-22px_rgba(139,96,63,0.6)] focus-visible:ring-3 focus-visible:ring-primary/25 focus-visible:outline-none motion-safe:hover:-translate-y-0.5 sm:p-5"
                  href={item.url}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-xs font-semibold text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-sm leading-tight font-semibold tracking-[-0.02em] sm:text-base">
                      {item.name}
                    </strong>
                    {item.description && (
                      <span className="mt-1.5 block text-xs leading-5 text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4.5 shrink-0 text-muted-foreground transition-[color,transform] group-hover:text-primary motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                  />
                </a>
              </li>
            ))}
          </ol>
        </div>

        {viewAll && (
          <a
            className="mt-6 flex h-11 items-center justify-center gap-2 rounded-xl border border-foreground/20 bg-background/60 text-sm font-semibold transition-[border-color,background-color] hover:border-primary/35 hover:bg-background md:hidden"
            href={viewAll.url}
          >
            {viewAll.label}
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        )}
      </div>
    </section>
  );
}
