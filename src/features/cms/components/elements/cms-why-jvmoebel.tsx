import {
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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
    <section
      aria-labelledby={headingId}
      className="relative isolate mt-16 overflow-hidden border-y border-foreground/10 bg-[radial-gradient(circle_at_18%_45%,rgba(224,203,184,0.72),transparent_32%),linear-gradient(to_bottom,#fbfaf6,#f6f1ea)] sm:mt-20"
      data-cms-element="jv-why-jvmoebel"
    >
      <div className="mx-auto grid w-full max-w-360 gap-12 px-5 py-14 sm:px-8 sm:py-18 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20 lg:px-12 lg:py-24">
        <div className="relative mx-auto flex aspect-square w-full max-w-72 items-center justify-center sm:max-w-88 lg:max-w-104">
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-[#cdb8a6]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-5 rotate-6 rounded-full border border-dashed border-[#b99b84]/65 sm:inset-7"
          />
          <span
            aria-hidden="true"
            className="absolute top-[12%] right-[8%] size-3 rounded-full bg-primary shadow-[0_0_0_8px_rgba(255,79,34,0.1)]"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-[15%] left-[5%] size-2.5 rounded-full bg-[#b28a70] shadow-[0_0_0_7px_rgba(178,138,112,0.14)]"
          />

          <div className="relative text-center">
            <span
              aria-hidden="true"
              className="block text-[clamp(4.5rem,17vw,8rem)] leading-[0.8] font-semibold -tracking-widest text-[#a57d63]"
            >
              {mark}
            </span>
            <p className="mx-auto mt-5 max-w-44 text-xs leading-5 font-semibold tracking-[0.12em] text-foreground/65 uppercase sm:text-sm">
              {tagline}
            </p>
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

          <ol className="mt-8 border-t border-foreground/15 sm:mt-10">
            {benefits.map((benefit, index) => {
              const BenefitIcon = benefitIcons[benefit.icon];

              return (
                <li className="border-b border-foreground/15" key={benefit.id}>
                  <a
                    className="group -mx-3 grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 px-3 py-5 transition-colors hover:bg-white/40 focus-visible:ring-3 focus-visible:ring-primary/25 focus-visible:outline-none sm:grid-cols-[3.5rem_1fr_auto] sm:gap-5 sm:py-6"
                    href={benefit.url}
                  >
                    <span className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 transition-transform motion-safe:group-hover:translate-x-1.5">
                      <span className="flex items-center gap-2.5">
                        <BenefitIcon
                          aria-hidden="true"
                          className="size-4.5 text-[#a86f4e]"
                        />
                        <strong className="text-base font-semibold tracking-tight sm:text-lg">
                          {benefit.title}
                        </strong>
                      </span>
                      <span className="mt-1.5 block text-xs leading-5 text-muted-foreground sm:text-sm">
                        {benefit.description}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-5 text-muted-foreground transition-[color,transform] group-hover:text-primary motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                    />
                  </a>
                </li>
              );
            })}
          </ol>

          {viewAll && (
            <a
              className="group mt-7 inline-flex items-center gap-3 text-sm font-semibold underline underline-offset-4 transition-colors hover:text-primary"
              href={viewAll.url}
            >
              {viewAll.label}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
              />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
