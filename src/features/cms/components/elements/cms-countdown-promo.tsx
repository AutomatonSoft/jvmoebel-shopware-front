import { Clock3, Copy } from "lucide-react";

import { Container } from "@/components/ui/container";
import { CmsButton } from "@/features/cms/components/cms-button";
import type { CmsElementProps } from "@/features/cms/components/cms-element";
import { CountdownPromoTimer } from "@/features/cms/components/elements/countdown-promo-timer";
import type { CmsCountdownPromoData } from "@/features/cms/contracts/countdown-promo";

export function CmsCountdownPromo({
  data,
}: CmsElementProps<CmsCountdownPromoData>) {
  return (
    <Container
      as="section"
      className="pt-16 sm:pt-20"
      data-cms-element="jv-countdown-promo"
    >
      <div className="relative isolate overflow-hidden rounded-3xl bg-accent px-6 py-8 sm:px-10 sm:py-10 lg:px-14">
        <div
          aria-hidden="true"
          className="absolute -top-28 -right-20 -z-10 size-72 rounded-full bg-primary/15 blur-3xl"
        />
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
          <div className="max-w-2xl">
            {data.eyebrow && (
              <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase">
                <Clock3 aria-hidden="true" className="size-4 text-primary" />
                {data.eyebrow}
              </p>
            )}
            <h2 className="mt-3 text-3xl leading-none font-semibold tracking-[-0.045em] text-balance sm:text-5xl">
              {data.title}
            </h2>
            {data.description && (
              <p className="mt-4 max-w-xl text-sm leading-6 sm:text-base">
                {data.description}
              </p>
            )}
          </div>

          <CountdownPromoTimer endsAt={data.endsAt} />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <CmsButton
            href={data.link.url}
            label={data.link.label}
            size={data.link.size}
          />
          {data.promoCode && (
            <p className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-foreground/20 bg-card/65 px-3 text-sm">
              <Copy aria-hidden="true" className="size-4 text-primary" />
              Code: <strong className="font-semibold">{data.promoCode}</strong>
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}
