import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import {
  addRequiredString,
  getCmsEntries,
  getCmsPosition,
  parseReferenceImage,
  parseReferenceLink,
  type CmsReferenceImage,
  type CmsReferenceLink,
} from "@/features/cms/contracts/reference-shared";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsLoyaltyPromoBenefit = Readonly<{
  id: string;
  position: number;
  text: string;
}>;

export type CmsLoyaltyPromoData = Readonly<{
  benefits: readonly CmsLoyaltyPromoBenefit[];
  description?: string;
  image: CmsReferenceImage;
  link: CmsReferenceLink;
  promoCode?: string;
  title: string;
}>;

function parseBenefits(
  value: unknown,
  issues: CmsContractIssue[],
): CmsLoyaltyPromoBenefit[] {
  return getCmsEntries(value)
    .flatMap(([key, benefitValue], index) => {
      const benefit = getCmsRecord(benefitValue);
      const path = `benefits.${key}`;
      const text = addRequiredString(benefit, "text", `${path}.text`, issues);

      if (!text) {
        return [];
      }

      return [
        {
          id: getCmsString(benefit, "id") || `${text}-${index}`,
          position: getCmsPosition(benefit, index),
          text,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);
}

export function parseCmsLoyaltyPromoData(
  value: unknown,
): CmsContractResult<CmsLoyaltyPromoData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const title = addRequiredString(record, "title", "title", issues);
  const benefits = parseBenefits(record?.benefits, issues);
  const image = parseReferenceImage(
    record?.image,
    "image",
    title || "",
    issues,
  );
  const link = parseReferenceLink(record?.link, "link", issues);

  if (benefits.length === 0) {
    issues.push({
      message: "At least one valid loyalty benefit is required.",
      path: "benefits",
    });
  }

  if (!title || benefits.length === 0 || !image || !link) {
    return { data: null, issues };
  }

  return {
    data: {
      benefits,
      description: getCmsString(record, "description"),
      image,
      link,
      promoCode: getCmsString(record, "promoCode"),
      title,
    },
    issues,
  };
}
