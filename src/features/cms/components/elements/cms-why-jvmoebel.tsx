import {
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import {
  parseCmsWhyJvmoebelData,
  type CmsWhyJvmoebelBenefitIcon,
} from "@/features/cms/contracts/why-jvmoebel";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

const benefitIcons = {
  advice: MessageCircle,
  design: Sparkles,
  payment: ShieldCheck,
} satisfies Record<CmsWhyJvmoebelBenefitIcon, typeof Sparkles>;

export function CmsWhyJvmoebel({ slot }: CmsSlotComponentProps) {
  const result = parseCmsWhyJvmoebelData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const { benefits, description, eyebrow, mark, tagline, title, viewAll } =
    result.data;
  const headingId = `why-jvmoebel-${slot.id}`;

  return (
    <Container
      as="section"
      aria-labelledby={headingId}
      className="mt-16 sm:mt-20"
      data-cms-element="jv-why-jvmoebel"
    >
      <div className="relative isolate overflow-hidden rounded-3xl border border-foreground/10 bg-secondary px-5 sm:px-8 lg:px-12">
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-[31%] hidden w-px bg-foreground/8 lg:block"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-32 -left-24 size-80 rounded-full border border-foreground/8"
        />

        <div className="relative grid gap-12 py-14 sm:py-18 lg:grid-cols-[0.68fr_1.32fr] lg:items-center lg:gap-20 lg:py-24">
          <div className="relative mx-auto flex min-h-64 w-full max-w-88 items-center lg:min-h-112 lg:max-w-none">
            <span
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-0 w-px bg-foreground/15"
            />
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 size-2 -translate-x-[3.5px] bg-primary"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 size-2 -translate-x-[3.5px] border border-foreground/35 bg-secondary"
            />

            <div className="relative pl-8 sm:pl-12 lg:pl-14">
              <span
                aria-hidden="true"
                className="block text-[clamp(7rem,18vw,11rem)] leading-[0.72] font-semibold -tracking-[0.1em] text-foreground"
              >
                {mark}
              </span>
              <div className="mt-8 flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-px w-8 shrink-0 bg-primary"
                />
                <p className="max-w-52 text-xs leading-5 font-semibold tracking-[0.14em] text-muted-foreground uppercase sm:text-sm sm:leading-6">
                  {tagline}
                </p>
              </div>
            </div>
          </div>

          <div>
            {eyebrow && (
              <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase before:block before:size-2 before:bg-primary">
                {eyebrow}
              </p>
            )}
            <h2
              className="max-w-2xl text-4xl leading-[0.98] font-semibold tracking-tighter text-balance sm:text-5xl lg:text-6xl"
              id={headingId}
            >
              {title}
            </h2>
            {description && (
              <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                {description}
              </p>
            )}

            <ol className="mt-8 border-y border-foreground/15 sm:mt-10">
              {benefits.map((benefit, index) => {
                const BenefitIcon = benefitIcons[benefit.icon];

                return (
                  <li
                    className="border-b border-foreground/15 last:border-b-0"
                    key={benefit.id}
                  >
                    <CmsLink
                      className="group -mx-3 grid grid-cols-[2rem_2.5rem_1fr_auto] items-center gap-3 px-3 py-5 transition-colors hover:bg-background/70 focus-visible:ring-3 focus-visible:ring-primary/25 focus-visible:outline-none sm:grid-cols-[2.5rem_2.75rem_1fr_auto] sm:gap-4 sm:py-6"
                      href={benefit.url}
                    >
                      <span className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex size-10 items-center justify-center rounded-full border border-foreground/10 bg-background text-primary transition-[background-color,color] group-hover:bg-primary group-hover:text-primary-foreground sm:size-11">
                        <BenefitIcon aria-hidden="true" className="size-4.5" />
                      </span>
                      <span className="min-w-0 transition-transform motion-safe:group-hover:translate-x-1.5">
                        <strong className="text-base font-semibold tracking-tight sm:text-lg">
                          {benefit.title}
                        </strong>
                        <span className="mt-1.5 block text-xs leading-5 text-muted-foreground sm:text-sm">
                          {benefit.description}
                        </span>
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-5 text-muted-foreground transition-[color,transform] group-hover:text-primary motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                      />
                    </CmsLink>
                  </li>
                );
              })}
            </ol>

            {viewAll && (
              <CmsLink
                className="group mt-8 inline-flex items-center gap-3 text-sm font-semibold transition-colors hover:text-primary"
                href={viewAll.url}
              >
                {viewAll.label}
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform motion-safe:group-hover:translate-x-1">
                  <ArrowRight aria-hidden="true" className="size-4" />
                </span>
              </CmsLink>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
