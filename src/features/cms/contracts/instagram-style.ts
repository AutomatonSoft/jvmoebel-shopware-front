import { getCmsRecord } from "@/features/cms/contracts/parsing";
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

export type CmsInstagramStyleData = Readonly<{
  caption: string;
  handle: string;
  image: CmsReferenceImage;
  link: CmsReferenceLink;
}>;

export function parseCmsInstagramStyleData(
  value: unknown,
): CmsContractResult<CmsInstagramStyleData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const handle = addRequiredString(record, "handle", "handle", issues);
  const caption = addRequiredString(record, "caption", "caption", issues);
  const image = parseReferenceImage(
    record?.image,
    "image",
    caption || "",
    issues,
  );
  const link = parseReferenceLink(record?.link, "link", issues);

  if (!handle || !caption || !image || !link) {
    return { data: null, issues };
  }

  return { data: { caption, handle, image, link }, issues };
}
