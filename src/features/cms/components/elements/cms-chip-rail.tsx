import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsChipRailData } from "@/features/cms/contracts/chip-rail";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

export function CmsChipRail({ slot }: CmsSlotComponentProps) {
  const result = parseCmsChipRailData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const { chips, eyebrow, title } = result.data;

  return (
    <Container
      as="section"
      className="pt-12 sm:pt-16"
      data-cms-element="jv-chip-rail"
    >
      <header className="mb-6 sm:mb-8">
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl leading-none font-semibold tracking-[-0.035em] text-balance sm:text-3xl">
          {title}
        </h2>
      </header>

      <nav aria-label={title}>
        <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:px-0 [&::-webkit-scrollbar]:hidden">
          {chips.map((chip) => (
            <li className="shrink-0 snap-start" key={chip.id}>
              <CmsLink
                className="group inline-flex min-h-12 items-center gap-3 rounded-full border bg-card px-5 text-sm font-semibold shadow-[0_10px_30px_-24px_rgba(21,21,19,0.65)] transition-[background-color,border-color,box-shadow] duration-300 hover:border-primary/40 hover:bg-accent hover:shadow-[0_14px_34px_-26px_rgba(21,21,19,0.6)] focus-visible:ring-3 focus-visible:ring-primary/25 focus-visible:outline-none"
                href={chip.url}
              >
                {chip.label}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 text-primary transition-transform duration-300 motion-safe:group-hover:translate-x-1"
                />
              </CmsLink>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
