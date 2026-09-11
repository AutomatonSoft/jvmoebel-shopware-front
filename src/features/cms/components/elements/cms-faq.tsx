import { ChevronDown } from "lucide-react";

import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsFaqData } from "@/features/cms/contracts/faq";
import { sanitizeCmsHtml } from "@/features/cms/lib/sanitize-html";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

export function CmsFaq({ slot }: CmsSlotComponentProps) {
  const result = parseCmsFaqData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const { description, eyebrow, items, title } = result.data;
  const headingId = `faq-${slot.id}`;

  return (
    <section
      aria-labelledby={headingId}
      className="mx-auto w-full max-w-360 px-4 py-16 sm:px-8 sm:py-20"
      data-cms-element="jv-faq"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(16rem,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
              {eyebrow}
            </p>
          )}
          <h2
            className="mt-3 text-3xl leading-tight font-semibold tracking-[-0.04em] text-balance"
            id={headingId}
          >
            {title}
          </h2>
          {description && (
            <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card">
          {items.map((item) => (
            <details className="group border-b last:border-b-0" key={item.id}>
              <summary className="flex min-h-18 cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-base font-semibold [&::-webkit-details-marker]:hidden sm:px-6">
                {item.question}
                <ChevronDown
                  aria-hidden="true"
                  className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                />
              </summary>
              <div
                className="cms-rich-text border-t bg-muted/20 px-5 py-5 text-sm leading-7 text-muted-foreground sm:px-6 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_p:not(:first-child)]:mt-3"
                dangerouslySetInnerHTML={{
                  __html: sanitizeCmsHtml(item.answer),
                }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
