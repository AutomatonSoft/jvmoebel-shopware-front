import { ArrowUpRight, BookOpen } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsElementProps } from "@/features/cms/components/cms-element";
import type { CmsGuideHubCardsData } from "@/features/cms/contracts/guide-hub-cards";

export function CmsGuideHubCards({
  data,
}: CmsElementProps<CmsGuideHubCardsData>) {
  const { cards, eyebrow, title } = data;

  return (
    <Container
      as="section"
      className="pt-16 sm:pt-20"
      data-cms-element="jv-guide-hub-cards"
    >
      <header className="mb-8 sm:mb-10">
        {eyebrow && (
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            <BookOpen aria-hidden="true" className="size-4" />
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl leading-none font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
          {title}
        </h2>
      </header>

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <li key={card.id}>
            <CmsLink
              className="group grid h-full overflow-hidden rounded-2xl border bg-card shadow-[0_18px_45px_-36px_rgba(21,21,19,0.7)] transition-[border-color,box-shadow] duration-300 hover:border-primary/35 hover:shadow-[0_24px_50px_-38px_rgba(21,21,19,0.65)] focus-visible:ring-3 focus-visible:ring-primary/25 focus-visible:ring-offset-4 focus-visible:outline-none"
              href={card.url}
            >
              <span className="relative block aspect-16/10 overflow-hidden bg-muted">
                <Image
                  alt={card.image.alt}
                  className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.035]"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  src={card.image.url}
                />
              </span>
              <span className="flex min-h-36 items-start gap-5 p-5 sm:p-6">
                <span className="min-w-0 flex-1">
                  <strong className="block text-xl leading-tight font-semibold tracking-[-0.03em]">
                    {card.title}
                  </strong>
                  {card.description && (
                    <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                      {card.description}
                    </span>
                  )}
                </span>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-transform duration-300 motion-safe:group-hover:translate-x-1">
                  <ArrowUpRight aria-hidden="true" className="size-5" />
                </span>
              </span>
            </CmsLink>
          </li>
        ))}
      </ul>
    </Container>
  );
}
