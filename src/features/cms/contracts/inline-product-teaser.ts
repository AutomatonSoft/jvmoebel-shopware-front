import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import {
  addRequiredString,
  parseReferenceImage,
  parseReferenceLink,
  type CmsReferenceImage,
  type CmsReferenceLink,
} from "@/features/cms/contracts/reference-shared";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsInlineProductTeaserData = Readonly<{
  description?: string;
  image: CmsReferenceImage;
  link: CmsReferenceLink;
  name: string;
  productId: string;
}>;

export function parseCmsInlineProductTeaserData(
  value: unknown,
): CmsContractResult<CmsInlineProductTeaserData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const productId = addRequiredString(record, "productId", "productId", issues);
  const name = addRequiredString(record, "name", "name", issues);
  const image = parseReferenceImage(record?.image, "image", name || "", issues);
  const link = parseReferenceLink(record?.link, "link", issues);

  if (!productId || !name || !image || !link) {
    return { data: null, issues };
  }

  return {
    data: {
      description: getCmsString(record, "description"),
      image,
      link,
      name,
      productId,
    },
    issues,
  };
}
