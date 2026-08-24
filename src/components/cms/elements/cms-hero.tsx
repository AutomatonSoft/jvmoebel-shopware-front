import Image from "next/image";

import { CmsButton } from "@/components/cms/cms-button";
import type { CmsSlotComponentProps } from "@/components/cms/cms-page-renderer";

function getRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

function getString(record: Record<string, unknown> | undefined, key: string) {
  const value = record?.[key];

  return typeof value === "string" && value.trim() ? value : undefined;
}

export function CmsHero({ slot }: CmsSlotComponentProps) {
  const data = getRecord(slot.data);
  const image = getRecord(data?.image);
  const primaryLink = getRecord(data?.primaryLink);
  const secondaryLink = getRecord(data?.secondaryLink);
  const title = getString(data, "title");
  const imageUrl = getString(image, "url");

  if (!title || !imageUrl) {
    return null;
  }

  const eyebrow = getString(data, "eyebrow");
  const description = getString(data, "description");
  const primaryLabel = getString(primaryLink, "label");
  const primaryUrl = getString(primaryLink, "url");
  const secondaryLabel = getString(secondaryLink, "label");
  const secondaryUrl = getString(secondaryLink, "url");

  return (
    <section
      className="relative isolate mx-2 mt-2 min-h-136 overflow-hidden rounded-3xl bg-foreground text-background sm:mx-6 sm:min-h-168"
      data-cms-element="jv-hero"
    >
      <Image
        alt={getString(image, "alt") || ""}
        className="scale-[1.005] object-cover"
        fill
        loading="eager"
        sizes="100vw"
        src={imageUrl}
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
          {(primaryLabel && primaryUrl) || (secondaryLabel && secondaryUrl) ? (
            <div className="mt-8 flex flex-wrap items-center gap-5">
              {primaryLabel && primaryUrl && (
                <CmsButton
                  href={primaryUrl}
                  label={primaryLabel}
                  size={primaryLink?.size}
                />
              )}
              {secondaryLabel && secondaryUrl && (
                <CmsButton
                  href={secondaryUrl}
                  label={secondaryLabel}
                  size={secondaryLink?.size}
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
