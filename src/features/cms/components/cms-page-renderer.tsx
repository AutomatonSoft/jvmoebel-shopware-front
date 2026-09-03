import type { ComponentType } from "react";

import { CmsCategoryRail } from "@/features/cms/components/elements/cms-category-rail";
import { CmsHero } from "@/features/cms/components/elements/cms-hero";
import { CmsNewsletter } from "@/features/cms/components/elements/cms-newsletter";
import { CmsProductGrid } from "@/features/cms/components/elements/cms-product-grid";
import { CmsRoomGrid } from "@/features/cms/components/elements/cms-room-grid";
import { CmsShopTheLook } from "@/features/cms/components/elements/cms-shop-the-look";
import { CmsText } from "@/features/cms/components/elements/cms-text";
import type {
  CmsBlock,
  CmsPage,
  CmsSection,
  CmsSlot,
} from "@/features/cms/model/page";
import { reportCmsRenderingIssue } from "@/features/cms/server/report-rendering-issue";
import { cn } from "@/lib/utils";

export type CmsSlotComponentProps = {
  slot: CmsSlot;
};

type CmsSlotComponent = ComponentType<CmsSlotComponentProps>;

const cmsSlotComponents: Record<string, CmsSlotComponent | undefined> = {
  "jv-category-rail": CmsCategoryRail,
  "jv-hero": CmsHero,
  "jv-newsletter": CmsNewsletter,
  "jv-product-grid": CmsProductGrid,
  "jv-room-grid": CmsRoomGrid,
  "jv-shop-the-look": CmsShopTheLook,
  text: CmsText,
};

function CmsSlotRenderer({ slot }: CmsSlotComponentProps) {
  const SlotComponent = cmsSlotComponents[slot.type];

  if (SlotComponent) {
    return <SlotComponent slot={slot} />;
  }

  reportCmsRenderingIssue({
    code: "unsupported-element",
    message: "No renderer is registered for this CMS element type.",
    slot,
  });

  if (process.env.NODE_ENV === "development") {
    return (
      <div data-cms-slot={slot.slot} data-cms-slot-type={slot.type}>
        Unsupported CMS element: {slot.type}
      </div>
    );
  }

  return null;
}

function CmsBlockRenderer({ block }: { block: CmsBlock }) {
  return (
    <div
      className={block.cssClass || undefined}
      data-cms-block-id={block.id}
      data-cms-block-type={block.type}
      style={{
        marginBottom: block.marginBottom || undefined,
        marginLeft: block.marginLeft || undefined,
        marginRight: block.marginRight || undefined,
        marginTop: block.marginTop || undefined,
      }}
    >
      {block.slots.map((slot) => (
        <CmsSlotRenderer key={slot.id} slot={slot} />
      ))}
    </div>
  );
}

function CmsSectionRenderer({ section }: { section: CmsSection }) {
  const blocks = [...section.blocks].sort(
    (first, second) => first.position - second.position,
  );

  return (
    <section
      className={cn(
        section.sizingMode === "boxed" &&
          "mx-auto w-full max-w-360 px-4 sm:px-8",
        section.cssClass,
      )}
      data-cms-section-id={section.id}
      data-cms-section-sizing={section.sizingMode}
      data-cms-section-type={section.type}
    >
      {blocks.map((block) => (
        <CmsBlockRenderer block={block} key={block.id} />
      ))}
    </section>
  );
}

export function CmsPageRenderer({ page }: { page: CmsPage }) {
  const sections = [...page.sections].sort(
    (first, second) => first.position - second.position,
  );

  return (
    <div
      className={page.cssClass || undefined}
      data-cms-page-id={page.id}
      data-cms-page-type={page.type}
    >
      {sections.map((section) => (
        <CmsSectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
