import { Check, Copy, Sparkles } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { CmsButton } from "@/features/cms/components/cms-button";
import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsLoyaltyPromoData } from "@/features/cms/contracts/loyalty-promo";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

export function CmsLoyaltyPromo({ slot }: CmsSlotComponentProps) {
  const result = parseCmsLoyaltyPromoData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const { benefits, description, image, link, promoCode, title } = result.data;

  return (
    <Container
      as="section"
      className="pt-16 sm:pt-20"
      data-cms-element="jv-loyalty-promo"
    >
      <div className="grid overflow-hidden rounded-3xl border bg-secondary shadow-[0_24px_60px_-46px_rgba(21,21,19,0.7)] lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.8fr)]">
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            <Sparkles aria-hidden="true" className="size-4" />
            Mitgliederprogramm
          </p>
          <h2 className="mt-3 text-3xl leading-none font-semibold tracking-[-0.045em] text-balance sm:text-5xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              {description}
            </p>
          )}

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <li
                className="flex items-start gap-3 text-sm leading-6"
                key={benefit.id}
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent">
                  <Check aria-hidden="true" className="size-3.5" />
                </span>
                {benefit.text}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CmsButton href={link.url} label={link.label} size={link.size} />
            {promoCode && (
              <span className="inline-flex min-h-10 items-center gap-2 rounded-lg border bg-card px-3 text-sm">
                <Copy aria-hidden="true" className="size-4 text-primary" />
                Code: <strong className="font-semibold">{promoCode}</strong>
              </span>
            )}
          </div>
        </div>

        <div className="relative min-h-80 bg-muted sm:min-h-112 lg:min-h-144">
          <Image
            alt={image.alt}
            className="object-cover"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            src={image.url}
          />
        </div>
      </div>
    </Container>
  );
}
