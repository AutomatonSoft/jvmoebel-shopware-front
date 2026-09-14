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

export type CmsAuthorFooterData = Readonly<{
  authorName: string;
  bio: string;
  expertise: string;
  image: CmsReferenceImage;
  link: CmsReferenceLink;
}>;

export function parseCmsAuthorFooterData(
  value: unknown,
): CmsContractResult<CmsAuthorFooterData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const authorName = addRequiredString(
    record,
    "authorName",
    "authorName",
    issues,
  );
  const expertise = addRequiredString(record, "expertise", "expertise", issues);
  const bio = addRequiredString(record, "bio", "bio", issues);
  const image = parseReferenceImage(
    record?.image,
    "image",
    authorName || "",
    issues,
  );
  const link = parseReferenceLink(record?.link, "link", issues);

  if (!authorName || !expertise || !bio || !image || !link) {
    return { data: null, issues };
  }

  return {
    data: { authorName, bio, expertise, image, link },
    issues,
  };
}
