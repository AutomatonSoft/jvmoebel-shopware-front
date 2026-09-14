import { ArrowUpRight, ShieldCheck, Star } from "lucide-react";

import { Container } from "@/components/ui/container";
import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsTrustRatingData } from "@/features/cms/contracts/trust-rating";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

const reviewCountFormatter = new Intl.NumberFormat("de-DE");

export function CmsTrustRating({ slot }: CmsSlotComponentProps) {
  const result = parseCmsTrustRatingData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const { link, providerLabel, rating, reviewCount } = result.data;
  const filledStars = Math.round(rating);
  const formattedRating = rating.toFixed(1).replace(".", ",");

  return (
    <Container
      as="section"
      className="pt-10 sm:pt-14"
      data-cms-element="jv-trust-rating"
    >
      <div className="flex flex-col gap-6 rounded-2xl border bg-card px-6 py-7 shadow-[0_18px_45px_-40px_rgba(21,21,19,0.7)] sm:flex-row sm:items-center sm:px-8">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent">
          <ShieldCheck aria-hidden="true" className="size-6 text-foreground" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            {providerLabel}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
            <strong className="text-2xl font-semibold tracking-[-0.035em] tabular-nums">
              {formattedRating}
            </strong>
            <span
              aria-label={`${rating.toFixed(1)} von 5 Sternen`}
              className="flex gap-1"
              role="img"
            >
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  aria-hidden="true"
                  className={`size-4 text-primary ${index < filledStars ? "fill-primary" : "fill-transparent"}`}
                  key={index}
                />
              ))}
            </span>
            <span className="text-sm text-muted-foreground">
              {reviewCountFormatter.format(reviewCount)} Bewertungen
            </span>
          </div>
        </div>

        <CmsLink
          className="group inline-flex w-fit shrink-0 items-center gap-2 text-sm font-semibold underline decoration-primary/45 underline-offset-4 transition-colors hover:text-primary"
          href={link.url}
        >
          {link.label}
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
          />
        </CmsLink>
      </div>
    </Container>
  );
}
