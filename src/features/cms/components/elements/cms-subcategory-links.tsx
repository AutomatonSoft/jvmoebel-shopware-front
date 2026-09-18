import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsElementProps } from "@/features/cms/components/cms-element";
import type { CmsSubcategoryLinksData } from "@/features/cms/contracts/subcategory-links";

export function CmsSubcategoryLinks({
  data,
  id,
}: CmsElementProps<CmsSubcategoryLinksData>) {
  const { links, title } = data;
  const headingId = `subcategory-links-${id}`;

  return (
    <Container
      as="section"
      className="pt-10 sm:pt-14"
      data-cms-element="jv-subcategory-links"
    >
      <nav aria-labelledby={headingId}>
        <h2
          className="mb-6 text-2xl leading-none font-semibold tracking-[-0.035em] sm:mb-8 sm:text-3xl"
          id={headingId}
        >
          {title}
        </h2>

        <ul className="grid overflow-hidden rounded-2xl border bg-card sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <li
              className="border-b last:border-b-0 sm:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
              key={link.id}
            >
              <CmsLink
                className="group flex min-h-16 items-center gap-4 px-5 py-4 text-sm font-semibold transition-colors hover:bg-secondary focus-visible:ring-3 focus-visible:ring-primary/25 focus-visible:ring-inset focus-visible:outline-none sm:px-6"
                href={link.url}
              >
                <span className="min-w-0 flex-1">{link.label}</span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-primary transition-transform motion-safe:group-hover:translate-x-1"
                />
              </CmsLink>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
