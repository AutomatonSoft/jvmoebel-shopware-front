import Image from "next/image";

import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import {
  parseCmsImageData,
  type CmsImageAlignment,
  type CmsImageData,
} from "@/features/cms/contracts/image";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";
import { cn } from "@/lib/utils";

const horizontalAlignmentClasses = {
  center: "justify-center",
  "flex-end": "justify-end",
  "flex-start": "justify-start",
} satisfies Record<CmsImageAlignment, string>;

const verticalAlignmentClasses = {
  center: "items-center",
  "flex-end": "items-end",
  "flex-start": "items-start",
} satisfies Record<CmsImageAlignment, string>;

function CmsImageContent({ data }: { data: CmsImageData }) {
  const { displayMode, fetchPriorityHigh, image, minHeight } = data;
  const commonProps = {
    fetchPriority: fetchPriorityHigh ? ("high" as const) : undefined,
    sizes: "(max-width: 1536px) 100vw, 1440px",
    src: image.url,
    title: image.title,
  };

  if (displayMode === "standard") {
    return (
      <Image
        {...commonProps}
        alt={image.alt}
        className="h-auto max-w-full"
        height={image.height ?? 900}
        width={image.width ?? 1600}
      />
    );
  }

  const hasIntrinsicRatio = Boolean(image.width && image.height);
  const useIntrinsicRatio = displayMode === "contain" && !minHeight;

  return (
    <span
      className="relative block w-full overflow-hidden"
      style={{
        aspectRatio:
          useIntrinsicRatio && hasIntrinsicRatio
            ? `${image.width} / ${image.height}`
            : undefined,
        minHeight:
          minHeight ||
          (!useIntrinsicRatio || !hasIntrinsicRatio ? "340px" : undefined),
      }}
    >
      <Image
        {...commonProps}
        alt={image.alt}
        className={cn(
          displayMode === "cover" && "object-cover",
          displayMode === "contain" && "object-contain",
          displayMode === "stretch" && "object-fill",
        )}
        fill
      />
    </span>
  );
}

export function CmsImage({ slot }: CmsSlotComponentProps) {
  const result = parseCmsImageData(slot);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const data = result.data;
  const image = <CmsImageContent data={data} />;

  return (
    <div
      className={cn(
        "flex h-full w-full",
        horizontalAlignmentClasses[data.horizontalAlign],
        verticalAlignmentClasses[data.verticalAlign],
      )}
      data-cms-element="image"
      data-display-mode={data.displayMode}
    >
      {data.link ? (
        <CmsLink
          aria-label={data.ariaLabel}
          className={cn(
            "block",
            data.displayMode === "standard" ? "max-w-full" : "w-full",
          )}
          href={data.link.url}
          rel={data.link.newTab ? "noopener noreferrer" : undefined}
          target={data.link.newTab ? "_blank" : undefined}
        >
          {image}
        </CmsLink>
      ) : (
        image
      )}
    </div>
  );
}
