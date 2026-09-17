import { Lightbulb } from "lucide-react";

import { Container } from "@/components/ui/container";
import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsExpertTipData } from "@/features/cms/contracts/expert-tip";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

export function CmsExpertTip({ slot }: CmsSlotComponentProps) {
  const result = parseCmsExpertTipData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const { body, label, title } = result.data;

  return (
    <Container
      as="section"
      className="pt-10 sm:pt-14"
      data-cms-element="jv-expert-tip"
    >
      <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-accent/55 px-6 py-7 sm:px-9 sm:py-9">
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-16 size-48 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative flex gap-4 sm:gap-6">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card text-primary shadow-sm sm:size-12">
            <Lightbulb aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              {label}
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              {title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/80 sm:text-base">
              {body}
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
