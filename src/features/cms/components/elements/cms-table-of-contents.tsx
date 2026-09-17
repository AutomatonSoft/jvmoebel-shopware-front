import { ArrowDownRight, List } from "lucide-react";

import { Container } from "@/components/ui/container";
import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsElementProps } from "@/features/cms/components/cms-element";
import type { CmsTableOfContentsData } from "@/features/cms/contracts/table-of-contents";

export function CmsTableOfContents({
  data,
  id,
}: CmsElementProps<CmsTableOfContentsData>) {
  const { items, title } = data;
  const headingId = `table-of-contents-${id}`;

  return (
    <Container
      as="section"
      className="pt-10 sm:pt-14"
      data-cms-element="jv-table-of-contents"
    >
      <nav
        aria-labelledby={headingId}
        className="rounded-2xl border bg-secondary/70 p-5 sm:p-7"
      >
        <h2
          className="flex items-center gap-3 text-xl font-semibold tracking-tight"
          id={headingId}
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-card text-primary shadow-sm">
            <List aria-hidden="true" className="size-4" />
          </span>
          {title}
        </h2>

        <ol className="mt-5 grid gap-x-8 sm:grid-cols-2">
          {items.map((item, index) => (
            <li
              className="border-t first:border-t-0 sm:first:border-t"
              key={item.id}
            >
              <CmsLink
                className="group flex min-h-14 items-center gap-3 py-3 text-sm font-semibold focus-visible:ring-3 focus-visible:ring-primary/25 focus-visible:outline-none"
                href={`#${item.anchorId}`}
              >
                <span className="text-xs text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">{item.label}</span>
                <ArrowDownRight
                  aria-hidden="true"
                  className="size-4 text-primary transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:translate-y-0.5"
                />
              </CmsLink>
            </li>
          ))}
        </ol>
      </nav>
    </Container>
  );
}
