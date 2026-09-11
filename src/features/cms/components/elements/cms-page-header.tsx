import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsPageHeaderData } from "@/features/cms/contracts/page-header";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

export function CmsPageHeader({ slot }: CmsSlotComponentProps) {
  const result = parseCmsPageHeaderData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const { description, eyebrow, title } = result.data;

  return (
    <header
      className="mx-auto w-full max-w-360 px-4 pt-9 pb-8 sm:px-8 sm:pt-12 sm:pb-10"
      data-cms-element="jv-page-header"
    >
      {eyebrow && (
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase before:block before:size-1.5 before:rounded-full before:bg-primary">
          {eyebrow}
        </p>
      )}
      <div className="flex flex-col gap-5 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-4xl leading-none font-semibold tracking-[-0.05em] text-balance sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-right">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
