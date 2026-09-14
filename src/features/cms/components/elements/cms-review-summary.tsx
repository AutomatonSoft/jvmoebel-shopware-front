import { Quote, Star } from "lucide-react";

import { Container } from "@/components/ui/container";
import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsReviewSummaryData } from "@/features/cms/contracts/review-summary";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

export function CmsReviewSummary({ slot }: CmsSlotComponentProps) {
  const result = parseCmsReviewSummaryData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const { rating, sourceLabel, summary } = result.data;
  const filledStars = Math.round(rating);
  const formattedRating = rating.toFixed(1).replace(".", ",");

  return (
    <Container
      as="section"
      className="pt-10 sm:pt-14"
      data-cms-element="jv-review-summary"
    >
      <div className="grid items-center gap-7 rounded-3xl border bg-card px-6 py-8 shadow-[0_18px_45px_-40px_rgba(21,21,19,0.7)] sm:grid-cols-[auto_1fr_auto] sm:px-9 sm:py-9">
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
          <Quote aria-hidden="true" className="size-5 fill-primary" />
        </span>

        <div>
          <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            {sourceLabel}
          </p>
          <blockquote className="mt-2 text-xl leading-tight font-semibold tracking-[-0.03em] sm:text-2xl">
            “{summary}”
          </blockquote>
        </div>

        <div className="sm:text-right">
          <strong className="text-3xl font-semibold tracking-[-0.04em] tabular-nums">
            {formattedRating}
          </strong>
          <div
            aria-label={`${rating.toFixed(1)} von 5 Sternen`}
            className="mt-1 flex gap-1 sm:justify-end"
            role="img"
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                aria-hidden="true"
                className={`size-4 text-primary ${index < filledStars ? "fill-primary" : "fill-transparent"}`}
                key={index}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
