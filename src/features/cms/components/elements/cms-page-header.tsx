import { Container } from "@/components/ui/container";
import type { CmsElementProps } from "@/features/cms/components/cms-element";
import type { CmsPageHeaderData } from "@/features/cms/contracts/page-header";

export function CmsPageHeader({ data }: CmsElementProps<CmsPageHeaderData>) {
  const { description, eyebrow, title } = data;

  return (
    <Container
      as="header"
      className="pt-9 pb-8 sm:pt-12 sm:pb-10"
      data-cms-element="jv-page-header"
    >
      {eyebrow && (
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase before:block before:size-1.5 before:rounded-full before:bg-primary">
          {eyebrow}
        </p>
      )}
      <div className="flex flex-col gap-5 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-4xl leading-none font-semibold tracking-tighter text-balance sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-right">
            {description}
          </p>
        )}
      </div>
    </Container>
  );
}
