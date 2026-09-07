import { ChevronDown } from "lucide-react";

import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsHomeEditorialData } from "@/features/cms/contracts/home-editorial";
import { sanitizeCmsHtml } from "@/features/cms/lib/sanitize-html";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";
import { cn } from "@/lib/utils";

function EditorialParagraph({ content }: { content: string }) {
  return <p dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(content) }} />;
}

export function CmsHomeEditorial({ slot }: CmsSlotComponentProps) {
  const result = parseCmsHomeEditorialData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const {
    appearance,
    introduction,
    sections,
    showLessLabel,
    showMoreLabel,
    statement,
    title,
  } = result.data;

  return (
    <section
      className={cn(
        appearance === "card"
          ? "mx-2 my-2 overflow-hidden rounded-3xl border border-foreground/10 bg-secondary/60 sm:mx-6 sm:my-4"
          : "mx-auto w-full max-w-360 px-4 py-16 sm:px-8 sm:py-24",
      )}
      data-cms-element="jv-home-editorial"
    >
      <div
        className={cn(
          "mx-auto w-full max-w-320",
          appearance === "card" &&
            "px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14",
        )}
      >
        <div
          className={cn(
            "grid gap-8 lg:grid-cols-[minmax(14rem,0.58fr)_minmax(0,1.42fr)]",
            appearance === "card"
              ? "lg:gap-10"
              : "border-t border-foreground/15 pt-10 lg:gap-16",
          )}
        >
          <p
            className={cn(
              "self-start",
              appearance === "card"
                ? "text-sm leading-7 text-muted-foreground sm:text-base"
                : "flex items-center gap-3 text-xs font-semibold tracking-[0.14em] text-primary uppercase before:block before:size-2 before:bg-primary",
            )}
          >
            {statement}
          </p>

          <div>
            <h2 className="max-w-4xl text-2xl leading-tight font-semibold tracking-[-0.04em] text-balance sm:text-3xl lg:text-4xl">
              {title}
            </h2>
            <div className="mt-5 grid gap-4 text-sm leading-7 text-muted-foreground [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:decoration-primary/45 [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:text-primary [&_a:focus-visible]:rounded-sm [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-primary">
              {introduction.map((paragraph, index) => (
                <EditorialParagraph
                  content={paragraph}
                  key={`${index}-${paragraph.slice(0, 24)}`}
                />
              ))}
            </div>
          </div>
        </div>

        <details
          className={cn(
            "group border-t border-foreground/10",
            appearance === "card" ? "mt-8 sm:mt-10" : "mt-12 sm:mt-16",
          )}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold outline-none transition-colors hover:text-primary focus-visible:text-primary [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">{showMoreLabel}</span>
            <span className="hidden group-open:inline">{showLessLabel}</span>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-background/70 transition-[border-color,background-color,color,transform] group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary group-open:rotate-180">
              <ChevronDown aria-hidden="true" className="size-4" />
            </span>
          </summary>

          <div className="grid gap-x-10 gap-y-8 border-t border-foreground/10 pt-8 md:grid-cols-2">
            {sections.map((section) => (
              <article
                className={cn(
                  appearance === "plain" &&
                    "border-t border-foreground/15 pt-6",
                )}
                key={section.id}
              >
                {section.title && (
                  <h3 className="mb-3 text-lg leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-xl">
                    {section.title}
                  </h3>
                )}
                <div className="grid gap-3 text-sm leading-7 text-muted-foreground [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:decoration-primary/45 [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:text-primary [&_a:focus-visible]:rounded-sm [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-primary">
                  {section.paragraphs.map((paragraph, index) => (
                    <EditorialParagraph
                      content={paragraph}
                      key={`${index}-${paragraph.slice(0, 24)}`}
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
