import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { getCmsTextContent } from "@/features/cms/contracts/text";
import { sanitizeCmsHtml } from "@/features/cms/lib/sanitize-html";

export function CmsText({ slot }: CmsSlotComponentProps) {
  const content = getCmsTextContent(slot);

  if (!content) {
    return null;
  }

  const sanitizedContent = sanitizeCmsHtml(content);

  if (!sanitizedContent.trim()) {
    return null;
  }

  return (
    <div
      className="cms-rich-text text-foreground [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_h1]:text-4xl [&_h1]:font-semibold [&_h2]:text-3xl [&_h2]:font-semibold [&_h3]:text-2xl [&_h3]:font-semibold [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:leading-7 [&_p:not(:first-child)]:mt-4 [&_table]:w-full [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
      data-cms-element="text"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
