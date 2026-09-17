import { BadgeEuro, RefreshCcw, Truck } from "lucide-react";

import { Container } from "@/components/ui/container";
import type { CmsElementProps } from "@/features/cms/components/cms-element";
import type {
  CmsBenefitStripData,
  CmsBenefitStripIcon,
} from "@/features/cms/contracts/benefit-strip";

const benefitIcons = {
  delivery: Truck,
  price: BadgeEuro,
  returns: RefreshCcw,
} satisfies Record<CmsBenefitStripIcon, typeof BadgeEuro>;

export function CmsBenefitStrip({
  data,
}: CmsElementProps<CmsBenefitStripData>) {
  return (
    <Container data-cms-element="jv-benefit-strip">
      <div className="grid overflow-hidden rounded-3xl border bg-card md:grid-cols-3">
        {data.items.map((item) => {
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
    </Container>
  );
}
