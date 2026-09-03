import { ChevronDown, Sparkles } from "lucide-react";

import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsHomeEditorialData } from "@/features/cms/contracts/home-editorial";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

export function CmsHomeEditorial({ slot }: CmsSlotComponentProps) {
  const result = parseCmsHomeEditorialData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const {
    introduction,
    sections,
    showLessLabel,
    showMoreLabel,
    statement,
    title,
  } = result.data;

  return (
    <section
      className="mx-2 my-2 overflow-hidden rounded-3xl border border-foreground/10 bg-secondary/60 sm:mx-6 sm:my-6"
      data-cms-element="jv-home-editorial"
    >
      <div className="mx-auto w-full max-w-360 px-6 py-14 sm:px-10 sm:py-18 lg:px-14 lg:py-22">
        <div className="grid gap-10 lg:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
          <div className="relative self-start rounded-3xl border border-foreground/10 bg-background/75 p-6 shadow-[0_24px_60px_-48px_rgba(91,65,43,0.7)] sm:p-8">
            <span className="mb-7 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles aria-hidden="true" className="size-5" />
            </span>
            <p className="text-lg leading-8 font-medium tracking-[-0.025em] text-balance sm:text-xl sm:leading-9">
              {statement}
            </p>
            <span
              aria-hidden="true"
              className="absolute right-7 bottom-7 size-2 rounded-full bg-accent"
            />
          </div>

          <div>
            <h2 className="max-w-4xl text-3xl leading-tight font-semibold tracking-[-0.04em] text-balance sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <div className="mt-7 grid gap-5 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              {introduction.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <details className="group mt-10 border-t border-foreground/10 sm:mt-12">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-semibold outline-none transition-colors hover:text-primary focus-visible:text-primary [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">{showMoreLabel}</span>
            <span className="hidden group-open:inline">{showLessLabel}</span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-background/70 transition-[border-color,background-color,color,transform] group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary group-open:rotate-180">
              <ChevronDown aria-hidden="true" className="size-4" />
            </span>
          </summary>

          <div className="grid gap-x-12 gap-y-10 border-t border-foreground/10 pt-10 md:grid-cols-2">
            {sections.map((section) => (
              <article key={section.id}>
                {section.title && (
                  <h3 className="mb-4 text-xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-2xl">
                    {section.title}
                  </h3>
                )}
                <div className="grid gap-4 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={`${index}-${paragraph.slice(0, 24)}`}>
                      {paragraph}
                    </p>
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
