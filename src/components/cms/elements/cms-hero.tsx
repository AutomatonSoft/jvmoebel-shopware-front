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
      className="relative isolate mx-2 mt-2 overflow-hidden rounded-2xl bg-foreground text-background sm:mx-4 sm:rounded-3xl lg:mx-6"
      data-cms-element="jv-hero"
    >
      <Image
        alt={image.alt}
        className="scale-[1.005] object-cover object-[58%_center] sm:object-center"
        fill
        loading="eager"
        sizes="(max-width: 640px) calc(100vw - 1rem), (max-width: 1024px) calc(100vw - 2rem), calc(100vw - 3rem)"
        src={image.url}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-black/5 sm:bg-linear-to-r sm:from-black/75 sm:via-black/35 sm:to-black/5" />
      <div className="relative mx-auto flex min-h-[clamp(28rem,calc(100svh-5.5rem),42rem)] max-w-360 items-end px-5 py-10 sm:items-center sm:px-10 sm:py-12 md:px-12 lg:px-20">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] uppercase before:block before:size-2 before:bg-primary sm:mb-5">
              {eyebrow}
            </p>
          )}
          <h1 className="text-[clamp(2.25rem,10vw,3rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/85 sm:mt-6 sm:text-base sm:leading-7">
              {description}
            </p>
          )}
          {primaryLink || secondaryLink ? (
            <div className="mt-6 flex flex-wrap items-center gap-4 sm:mt-8 sm:gap-5">
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
