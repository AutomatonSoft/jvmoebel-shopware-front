import Image from "next/image";

import { CmsButton } from "@/components/cms/cms-button";
import type { CmsSlotComponentProps } from "@/components/cms/cms-page-renderer";
import { parseCmsHeroData } from "@/lib/cms/contracts/hero";

export function CmsHero({ slot }: CmsSlotComponentProps) {
  const data = parseCmsHeroData(slot.data);

  if (!data) {
    return null;
  }

  const { description, eyebrow, image, primaryLink, secondaryLink, title } =
    data;

  return (
    <section
      className="relative isolate mx-2 mt-2 min-h-136 overflow-hidden rounded-3xl bg-foreground text-background sm:mx-6 sm:min-h-168"
      data-cms-element="jv-hero"
    >
      <Image
        alt={image.alt}
        className="scale-[1.005] object-cover"
        fill
        loading="eager"
        sizes="100vw"
        src={image.url}
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/35 to-black/5" />
      <div className="relative mx-auto flex min-h-136 max-w-360 items-end px-6 py-14 sm:min-h-168 sm:items-center sm:px-12 lg:px-20">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] uppercase before:block before:size-2 before:bg-primary">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl leading-[0.98] font-semibold tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
              {description}
            </p>
          )}
          {primaryLink || secondaryLink ? (
            <div className="mt-8 flex flex-wrap items-center gap-5">
              {primaryLink && (
                <CmsButton
                  href={primaryLink.url}
                  label={primaryLink.label}
                  size={primaryLink.size}
                />
              )}
              {secondaryLink && (
                <CmsButton
                  href={secondaryLink.url}
                  label={secondaryLink.label}
                  size={secondaryLink.size}
                  variant="link"
                />
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
