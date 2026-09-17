import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsElementProps } from "@/features/cms/components/cms-element";
import type { CmsTrendLookGridData } from "@/features/cms/contracts/trend-look-grid";
import { cn } from "@/lib/utils";

export function CmsTrendLookGrid({
  data,
}: CmsElementProps<CmsTrendLookGridData>) {
  const { cards, eyebrow, title } = data;

  return (
    <Container
      as="section"
      className="pt-16 sm:pt-20"
      data-cms-element="jv-trend-look-grid"
    >
      <header className="mb-8 sm:mb-10">
        {eyebrow && (
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase before:block before:size-2 before:bg-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl leading-none font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
          {title}
        </h2>
      </header>

      <ul className="grid auto-rows-80 gap-4 sm:grid-cols-2 sm:auto-rows-96 lg:grid-cols-3">
        {cards.map((card, index) => (
          <li
            className={cn(
              cards.length > 1 &&
                index === 0 &&
                "sm:col-span-2 lg:row-span-2 lg:min-h-196",
            )}
            key={card.id}
          >
            <article className="group relative isolate size-full overflow-hidden rounded-2xl bg-muted">
              <Image
                alt={card.image.alt}
                className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.035]"
                fill
                sizes={
                  index === 0
                    ? "(max-width: 1024px) 100vw, 66vw"
                    : "(max-width: 640px) 100vw, 33vw"
                }
                src={card.image.url}
              />
              <span className="absolute inset-0 bg-linear-to-t from-black/75 via-black/5 to-transparent" />

              <CmsLink
                aria-label={card.title}
                className="absolute inset-0 z-10 rounded-2xl focus-visible:ring-3 focus-visible:ring-primary focus-visible:ring-inset focus-visible:outline-none"
                href={card.url}
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-5 p-5 text-white sm:p-7">
                <div>
                  <h3 className="text-2xl leading-tight font-semibold tracking-[-0.035em] text-balance sm:text-3xl">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="mt-2 text-sm leading-6 text-white/80">
                      {card.description}
                    </p>
                  )}
                </div>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-foreground transition-transform duration-300 motion-safe:group-hover:translate-x-1">
                  <ArrowUpRight aria-hidden="true" className="size-5" />
                </span>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Container>
  );
}
