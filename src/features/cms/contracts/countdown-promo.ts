import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import {
  addRequiredString,
  parseReferenceLink,
  type CmsReferenceLink,
} from "@/features/cms/contracts/reference-shared";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsCountdownPromoData = Readonly<{
  description?: string;
  endsAt: string;
  eyebrow?: string;
  link: CmsReferenceLink;
  promoCode?: string;
  title: string;
}>;

export function parseCmsCountdownPromoData(
  value: unknown,
): CmsContractResult<CmsCountdownPromoData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const title = addRequiredString(record, "title", "title", issues);
  const endsAt = addRequiredString(record, "endsAt", "endsAt", issues);
  const link = parseReferenceLink(record?.link, "link", issues);
  const hasValidDeadline = endsAt ? Number.isFinite(Date.parse(endsAt)) : false;

  if (endsAt && !hasValidDeadline) {
    issues.push({
      message: "endsAt must be a valid date-time string.",
      path: "endsAt",
    });
  }

  if (!title || !endsAt || !hasValidDeadline || !link) {
    return { data: null, issues };
  }

  return {
    data: {
      description: getCmsString(record, "description"),
      endsAt,
      eyebrow: getCmsString(record, "eyebrow"),
      link,
      promoCode: getCmsString(record, "promoCode"),
      title,
    },
    issues,
  };
}
