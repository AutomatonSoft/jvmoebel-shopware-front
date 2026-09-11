import { BadgeEuro, RefreshCcw, Truck } from "lucide-react";

import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import {
  parseCmsBenefitStripData,
  type CmsBenefitStripIcon,
} from "@/features/cms/contracts/benefit-strip";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

const benefitIcons = {
  delivery: Truck,
  price: BadgeEuro,
  returns: RefreshCcw,
} satisfies Record<CmsBenefitStripIcon, typeof BadgeEuro>;

export function CmsBenefitStrip({ slot }: CmsSlotComponentProps) {
  const result = parseCmsBenefitStripData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  return (
    <div
      className="mx-auto grid w-[calc(100%_-_2rem)] max-w-360 overflow-hidden rounded-3xl border bg-card sm:w-[calc(100%_-_4rem)] md:grid-cols-3"
      data-cms-element="jv-benefit-strip"
    >
      {result.data.items.map((item) => {
        const Icon = benefitIcons[item.icon];

        return (
          <article
            className="flex gap-4 border-b p-6 last:border-b-0 sm:p-8 md:border-r md:border-b-0 md:last:border-r-0"
            key={item.id}
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon aria-hidden="true" className="size-6" />
            </span>
            <div>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
