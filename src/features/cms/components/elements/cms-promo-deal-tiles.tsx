import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsPromoDealTilesData } from "@/features/cms/contracts/promo-deal-tiles";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

const dealDateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
});

export function CmsPromoDealTiles({ slot }: CmsSlotComponentProps) {
  const result = parseCmsPromoDealTilesData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const { eyebrow, tiles, title } = result.data;

  return (
    <Container
      as="section"
      className="pt-16 sm:pt-20"
      data-cms-element="jv-promo-deal-tiles"
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

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <li key={tile.id}>
            <article className="group relative isolate aspect-4/5 overflow-hidden rounded-2xl bg-muted shadow-[0_18px_45px_-34px_rgba(21,21,19,0.75)] sm:aspect-5/6">
              <Image
                alt={tile.image.alt}
                className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                src={tile.image.url}
              />
              <span className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

              <CmsLink
                aria-label={`${tile.link.label}: ${tile.label}`}
                className="absolute inset-0 z-10 rounded-2xl focus-visible:ring-3 focus-visible:ring-primary focus-visible:ring-inset focus-visible:outline-none"
                href={tile.link.url}
              />

              {tile.discountLabel && (
                <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm">
                  {tile.discountLabel}
                </span>
              )}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-5 text-white sm:p-6">
                {tile.endsAt && (
                  <time
                    className="text-xs font-semibold tracking-[0.12em] text-white/80 uppercase"
                    dateTime={tile.endsAt}
                  >
                    Nur bis {dealDateFormatter.format(new Date(tile.endsAt))}
                  </time>
                )}
                <h3 className="mt-2 text-2xl leading-tight font-semibold tracking-[-0.035em] text-balance sm:text-3xl">
                  {tile.label}
                </h3>
                {tile.description && (
                  <p className="mt-2 text-sm leading-6 text-white/85">
                    {tile.description}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline decoration-white/55 underline-offset-4 group-hover:decoration-white">
                  {tile.link.label}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
                  />
                </span>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Container>
  );
}
