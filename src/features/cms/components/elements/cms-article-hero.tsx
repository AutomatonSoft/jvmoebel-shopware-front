import { CalendarDays, Clock3 } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsArticleHeroData } from "@/features/cms/contracts/article-hero";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

const articleDateFormatter = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "long",
  timeZone: "Europe/Berlin",
});

export function CmsArticleHero({ slot }: CmsSlotComponentProps) {
  const result = parseCmsArticleHeroData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const data = result.data;

  return (
    <Container
      as="header"
      className="pt-8 sm:pt-12"
      data-cms-element="jv-article-hero"
    >
      <div className="grid overflow-hidden rounded-3xl border bg-card shadow-[0_24px_60px_-44px_rgba(21,21,19,0.65)] lg:grid-cols-[minmax(20rem,0.85fr)_minmax(0,1.15fr)]">
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
          {data.eyebrow && (
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              {data.eyebrow}
            </p>
          )}
          <h1 className="mt-4 text-4xl leading-[0.98] font-semibold tracking-[-0.055em] text-balance sm:text-5xl lg:text-6xl">
            {data.title}
          </h1>
          {data.description && (
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              {data.description}
            </p>
          )}
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t pt-5 text-xs font-medium text-muted-foreground sm:text-sm">
            <time
              className="inline-flex items-center gap-2"
              dateTime={data.publishedAt}
            >
              <CalendarDays
                aria-hidden="true"
                className="size-4 text-primary"
              />
              {articleDateFormatter.format(new Date(data.publishedAt))}
            </time>
            <span className="inline-flex items-center gap-2">
              <Clock3 aria-hidden="true" className="size-4 text-primary" />
              {data.readTimeMinutes} Min. Lesezeit
            </span>
          </div>
        </div>

        <div className="relative min-h-72 bg-muted sm:min-h-[28rem] lg:min-h-[36rem]">
          <Image
            alt={data.image.alt}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            src={data.image.url}
          />
        </div>
      </div>
    </Container>
  );
}
