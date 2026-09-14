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

export type CmsExpertProfileData = Readonly<{
  bio: string;
  image: CmsReferenceImage;
  link: CmsReferenceLink;
  name: string;
  role: string;
}>;

export function parseCmsExpertProfileData(
  value: unknown,
): CmsContractResult<CmsExpertProfileData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const name = addRequiredString(record, "name", "name", issues);
  const role = addRequiredString(record, "role", "role", issues);
  const bio = addRequiredString(record, "bio", "bio", issues);
  const image = parseReferenceImage(record?.image, "image", name || "", issues);
  const link = parseReferenceLink(record?.link, "link", issues);

  if (!name || !role || !bio || !image || !link) {
    return { data: null, issues };
  }

  return {
    data: { bio, image, link, name, role },
    issues,
  };
}
