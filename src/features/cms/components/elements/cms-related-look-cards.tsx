import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsRelatedLookCardsData } from "@/features/cms/contracts/related-look-cards";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

export function CmsRelatedLookCards({ slot }: CmsSlotComponentProps) {
  const result = parseCmsRelatedLookCardsData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const { cards, title } = result.data;

  return (
    <Container
      as="section"
      className="pt-16 sm:pt-20"
      data-cms-element="jv-related-look-cards"
    >
      <h2 className="mb-8 text-3xl leading-none font-semibold tracking-[-0.04em] text-balance sm:mb-10 sm:text-4xl">
        {title}
      </h2>

      <ul className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={card.id}>
            <CmsLink
              className="group block rounded-2xl focus-visible:ring-3 focus-visible:ring-primary/25 focus-visible:ring-offset-4 focus-visible:outline-none"
              href={card.url}
            >
              <span className="relative block aspect-4/3 overflow-hidden rounded-2xl bg-muted">
                <Image
                  alt={card.image.alt}
                  className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  src={card.image.url}
                />
              </span>
              <span className="mt-4 flex items-start justify-between gap-4 px-1">
                <span>
                  <strong className="block text-lg leading-tight font-semibold tracking-tight sm:text-xl">
                    {card.title}
                  </strong>
                  {card.description && (
                    <span className="mt-1.5 block text-sm leading-6 text-muted-foreground">
                      {card.description}
                    </span>
                  )}
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="mt-1 size-5 shrink-0 text-primary transition-transform motion-safe:group-hover:translate-x-1"
                />
              </span>
            </CmsLink>
          </li>
        ))}
      </ul>
    </Container>
  );
}
