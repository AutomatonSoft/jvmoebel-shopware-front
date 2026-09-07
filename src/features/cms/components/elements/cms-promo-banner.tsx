import Image from "next/image";

import { CmsButton } from "@/features/cms/components/cms-button";
import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import {
  parseCmsPromoBannerData,
  type CmsPromoBannerData,
} from "@/features/cms/contracts/promo-banner";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";
import { cn } from "@/lib/utils";

function PromoBannerCopy({
  data,
  mobile = false,
}: {
  data: CmsPromoBannerData;
  mobile?: boolean;
}) {
  return (
    <div className={cn(mobile && "p-6 sm:hidden")}>
      {data.eyebrow && (
        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          {data.eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-2xl leading-tight font-semibold tracking-[-0.04em] text-balance lg:text-4xl">
        {data.title}
      </h2>
      {data.description && (
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground lg:text-base lg:leading-7">
          {data.description}
        </p>
      )}
      {data.link && (
        <div className="mt-5 w-fit">
          <CmsButton
            href={data.link.url}
            label={data.link.label}
            size={data.link.size}
          />
        </div>
      )}
    </div>
  );
}

export function CmsPromoBanner({ slot }: CmsSlotComponentProps) {
  const result = parseCmsPromoBannerData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const data = result.data;

  return (
    <section
      className="mx-2 mt-16 overflow-hidden rounded-3xl border bg-card shadow-[0_24px_60px_-42px_rgba(21,21,19,0.7)] sm:mx-6 sm:mt-20"
      data-cms-element="jv-promo-banner"
    >
      <div className="relative min-h-72 sm:min-h-96">
        <Image
          alt={data.image.alt}
          className="object-cover"
          fill
          sizes="(max-width: 1536px) 100vw, 1440px"
          src={data.image.url}
        />
        <div
          className={cn(
            "absolute inset-y-0 hidden w-[46%] flex-col justify-center bg-background/92 p-8 backdrop-blur-sm sm:flex lg:p-12",
            data.contentPosition === "left" ? "left-0" : "right-0",
          )}
        >
          <PromoBannerCopy data={data} />
        </div>
      </div>
      <PromoBannerCopy data={data} mobile />
    </section>
  );
}
