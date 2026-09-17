import type { CSSProperties } from "react";

import type {
  CmsBackgroundMediaMode,
  CmsBlock,
  CmsVisibility,
} from "@/features/cms/model/page";
import { cn } from "@/lib/utils";

const passiveCmsSlotTypes = new Set(["sidebar-filter"]);

export function getCmsVisibilityClassName(visibility?: CmsVisibility) {
  return cn(
    visibility?.mobile === false && "max-md:hidden",
    visibility?.tablet === false && "md:max-lg:hidden",
    visibility?.desktop === false && "lg:hidden",
  );
}

export function getCmsBackgroundStyle(background: {
  backgroundColor?: string;
  backgroundMediaMode?: CmsBackgroundMediaMode;
  backgroundMediaUrl?: string;
}): CSSProperties {
  return {
    backgroundColor: background.backgroundColor || undefined,
    backgroundImage: background.backgroundMediaUrl
      ? `url(${JSON.stringify(background.backgroundMediaUrl)})`
      : undefined,
    backgroundPosition: background.backgroundMediaUrl ? "center" : undefined,
    backgroundRepeat: background.backgroundMediaUrl ? "no-repeat" : undefined,
    backgroundSize: background.backgroundMediaUrl
      ? background.backgroundMediaMode
      : undefined,
  };
}

export function isPassiveCmsBlock(block: CmsBlock) {
  return (
    block.slots.length > 0 &&
    block.slots.every((slot) => passiveCmsSlotTypes.has(slot.type))
  );
}
