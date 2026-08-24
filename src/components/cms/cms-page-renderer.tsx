import type { ComponentType } from "react";

import { CmsText } from "@/components/cms/elements/cms-text";
import type { CmsPage } from "@/lib/shopware/cms";
import { cn } from "@/lib/utils";

type CmsSection = CmsPage["sections"][number];
type CmsBlock = CmsSection["blocks"][number];
type CmsSlot = CmsBlock["slots"][number];

export type CmsSlotComponentProps = {
  slot: CmsSlot;
};

type CmsSlotComponent = ComponentType<CmsSlotComponentProps>;

const cmsSlotComponents: Record<string, CmsSlotComponent | undefined> = {
  text: CmsText,
};

function CmsSlotRenderer({ slot }: CmsSlotComponentProps) {
  const SlotComponent = cmsSlotComponents[slot.type];

  if (SlotComponent) {
    return <SlotComponent slot={slot} />;
  }

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
