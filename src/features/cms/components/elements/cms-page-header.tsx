import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import type { CmsElementProps } from "@/features/cms/components/cms-element";
import type { CmsPageHeaderData } from "@/features/cms/contracts/page-header";

export function CmsPageHeader({ data }: CmsElementProps<CmsPageHeaderData>) {
  const { description, eyebrow, title } = data;

  return (
    <Container className="pt-5 pb-6 sm:pt-6 sm:pb-8">
      <PageHeader
        aside={
          description ? (
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-right">
              {description}
            </p>
          ) : undefined
        }
        data-cms-element="jv-page-header"
        eyebrow={eyebrow}
        title={title}
      />
    </Container>
  );
}
