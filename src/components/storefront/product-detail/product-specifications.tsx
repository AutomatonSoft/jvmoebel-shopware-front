import { ArrowLeftRight, MoveVertical, Ruler } from "lucide-react";

import type {
  ShopProductDimensions,
  ShopProductSpecification,
} from "@/lib/shopware/product-detail";

export type ProductSpecificationsProps = {
  description: string;
  dimensions: ShopProductDimensions;
  specifications: readonly ShopProductSpecification[];
};

export function ProductSpecifications({
  description,
  dimensions,
  specifications,
}: ProductSpecificationsProps) {
  const dimensionItems = [
    {
      icon: ArrowLeftRight,
      label: "Width",
      value: dimensions.width,
    },
    {
      icon: MoveVertical,
      label: "Height",
      value: dimensions.height,
    },
    {
      icon: Ruler,
      label: "Length",
      value: dimensions.length,
    },
  ];

  return (
    <section
      aria-labelledby="product-specifications-title"
      className="py-16 sm:py-20"
    >
      <div className="overflow-hidden rounded-3xl border bg-muted/55 px-5 py-7 text-foreground shadow-[0_0_0_1px_rgba(21,21,19,0.02)] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(32rem,1.25fr)] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
              Product specifications
            </p>
            <h2
              className="mt-4 max-w-xl text-3xl leading-tight font-semibold tracking-[-0.04em] text-balance sm:text-4xl"
              id="product-specifications-title"
            >
              Technical characteristics
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            {dimensionItems.map((dimension) => {
              const Icon = dimension.icon;

              return (
                <div
                  className="min-w-0 rounded-2xl border bg-background/75 p-3 shadow-xs sm:p-5"
                  key={dimension.label}
                >
                  <div className="flex items-center gap-2 text-[0.625rem] tracking-[0.1em] text-muted-foreground uppercase">
                    <Icon className="hidden size-3.5 shrink-0 sm:block" />
                    {dimension.label}
                  </div>
                  <p className="mt-3 flex min-w-0 items-baseline gap-1">
                    <strong className="min-w-0 text-2xl leading-none font-bold tracking-tight wrap-break-word sm:text-3xl">
                      {dimension.value}
                    </strong>
                    <span className="text-xs text-muted-foreground">
                      {dimensions.unit}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2 lg:mt-10">
          {specifications.map((specification) => (
            <div
              className="min-w-0 bg-background/80 px-4 py-4 sm:px-5 sm:py-5"
              key={specification.id}
            >
              <dt className="text-[0.625rem] tracking-[0.1em] text-muted-foreground uppercase">
                {specification.label}
              </dt>
              <dd className="mt-2 text-sm font-semibold wrap-break-word">
                {specification.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
