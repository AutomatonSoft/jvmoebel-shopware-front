import { ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { CmsButton } from "@/features/cms/components/cms-button";
import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsElementProps } from "@/features/cms/components/cms-element";
import type { CmsLookSceneData } from "@/features/cms/contracts/look-scene";

export function CmsLookScene({ data }: CmsElementProps<CmsLookSceneData>) {
  return (
    <Container
      as="section"
      className="pt-16 sm:pt-20"
      data-cms-element="jv-look-scene"
    >
      <div className="grid overflow-hidden rounded-3xl border bg-card shadow-[0_24px_60px_-44px_rgba(21,21,19,0.65)] lg:grid-cols-[minmax(0,1.7fr)_minmax(19rem,0.7fr)]">
        <div className="relative min-h-80 bg-muted sm:min-h-136">
          <Image
            alt={data.image.alt}
            className="object-cover"
            fill
            sizes="(max-width: 1024px) 100vw, 70vw"
            src={data.image.url}
          />
        </div>

        <div className="flex flex-col p-6 sm:p-9 lg:p-10">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-primary uppercase">
            <ShoppingBag aria-hidden="true" className="size-4" />
            Look shoppen
          </p>
          <h2 className="mt-3 text-3xl leading-none font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
            {data.title}
          </h2>
          {data.description && (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {data.description}
            </p>
          )}

          <ol className="mt-8 divide-y border-y">
            {data.products.map((product, index) => (
              <li key={product.id}>
                <CmsLink
                  className="group flex min-h-16 items-center gap-4 py-3 focus-visible:ring-3 focus-visible:ring-primary/25 focus-visible:outline-none"
                  href={product.url}
                  target="_blank"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong className="flex-1 text-sm font-semibold">
                    {product.name}
                  </strong>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 text-primary transition-transform motion-safe:group-hover:translate-x-1"
                  />
                </CmsLink>
              </li>
            ))}
          </ol>

          {data.viewAll && (
            <div className="mt-8 w-fit lg:mt-auto lg:pt-8">
              <CmsButton
                href={data.viewAll.url}
                label={data.viewAll.label}
                size={data.viewAll.size}
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
