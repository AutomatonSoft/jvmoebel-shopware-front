import { ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsInlineProductTeaserData } from "@/features/cms/contracts/inline-product-teaser";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

export function CmsInlineProductTeaser({ slot }: CmsSlotComponentProps) {
  const result = parseCmsInlineProductTeaserData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const { description, image, link, name, productId } = result.data;

  return (
    <Container
      as="section"
      className="pt-10 sm:pt-14"
      data-cms-element="jv-inline-product-teaser"
      data-product-id={productId}
    >
      <CmsLink
        aria-label={link.label}
        className="group grid overflow-hidden rounded-2xl border bg-card shadow-[0_18px_45px_-38px_rgba(21,21,19,0.7)] transition-[border-color,transform] hover:border-primary/35 focus-visible:ring-3 focus-visible:ring-primary/25 focus-visible:ring-offset-4 focus-visible:outline-none motion-safe:hover:-translate-y-0.5 sm:grid-cols-[13rem_1fr_auto] sm:items-center"
        href={link.url}
      >
        <span className="relative block aspect-4/3 overflow-hidden bg-muted sm:aspect-square">
          <Image
            alt={image.alt}
            className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
            fill
            sizes="(max-width: 640px) 100vw, 208px"
            src={image.url}
          />
        </span>

        <span className="p-5 sm:px-7 sm:py-6">
          <span className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            <ShoppingBag aria-hidden="true" className="size-4" />
            Produkt entdecken
          </span>
          <strong className="mt-2 block text-2xl leading-tight font-semibold tracking-[-0.035em] sm:text-3xl">
            {name}
          </strong>
          {description && (
            <span className="mt-2 block text-sm leading-6 text-muted-foreground">
              {description}
            </span>
          )}
        </span>

        <span className="mx-5 mb-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground sm:mx-7 sm:mb-0">
          {link.label}
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
          />
        </span>
      </CmsLink>
    </Container>
  );
}
