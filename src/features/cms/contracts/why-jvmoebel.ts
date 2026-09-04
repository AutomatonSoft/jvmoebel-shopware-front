import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsWhyJvmoebelBenefitIcon = "advice" | "design" | "payment";

export type CmsWhyJvmoebelBenefit = Readonly<{
  description: string;
  icon: CmsWhyJvmoebelBenefitIcon;
  id: string;
  position: number;
  title: string;
  url: string;
}>;

export type CmsWhyJvmoebelLink = Readonly<{
  label: string;
  url: string;
}>;

export type CmsWhyJvmoebelData = Readonly<{
  benefits: readonly CmsWhyJvmoebelBenefit[];
  description?: string;
  eyebrow?: string;
  mark: string;
  tagline: string;
  title: string;
  viewAll?: CmsWhyJvmoebelLink;
}>;

function parseBenefitIcon(
  value: unknown,
): CmsWhyJvmoebelBenefitIcon | undefined {
  return value === "advice" || value === "design" || value === "payment"
    ? value
    : undefined;
}

function parseBenefits(value: unknown): Readonly<{
  data: CmsWhyJvmoebelBenefit[];
  issues: readonly CmsContractIssue[];
}> {
  const benefitsRecord = getCmsRecord(value);
  const benefitEntries = Array.isArray(value)
    ? value.map((benefit, index) => [String(index), benefit] as const)
    : benefitsRecord
      ? Object.entries(benefitsRecord)
      : [];
  const issues: CmsContractIssue[] = [];

  const benefits = benefitEntries
    .flatMap(([key, benefitValue], index) => {
      const benefit = getCmsRecord(benefitValue);
      const description = getCmsString(benefit, "description");
      const icon = parseBenefitIcon(benefit?.icon);
      const title = getCmsString(benefit, "title");
      const url = getCmsString(benefit, "url");
      const missingFields = [
        !description && "description",
        !icon && "icon",
        !title && "title",
        !url && "url",
      ].filter((field): field is string => Boolean(field));

      if (!description || !icon || !title || !url) {
        issues.push({
          message: `Benefit is missing or has invalid required fields: ${missingFields.join(", ")}.`,
          path: `benefits.${key}`,
        });

        return [];
      }

      const position = benefit?.position;

      return [
        {
          description,
          icon,
          id: getCmsString(benefit, "id") || `${title}-${index}`,
          position:
            typeof position === "number" && Number.isFinite(position)
              ? position
              : index,
          title,
          url,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);

  return { data: benefits, issues };
}

function parseLink(value: unknown): Readonly<{
  data?: CmsWhyJvmoebelLink;
  issues: readonly CmsContractIssue[];
}> {
  if (value === undefined || value === null) {
    return { issues: [] };
  }

  const link = getCmsRecord(value);
  const label = getCmsString(link, "label");
  const url = getCmsString(link, "url");

  if (!label || !url) {
    return {
      issues: [
        {
          message: `View-all link is missing required fields: ${[
            !label && "label",
            !url && "url",
          ]
            .filter(Boolean)
            .join(", ")}.`,
          path: "viewAll",
        },
      ],
    };
  }

  return { data: { label, url }, issues: [] };
}

export function parseCmsWhyJvmoebelData(
  value: unknown,
): CmsContractResult<CmsWhyJvmoebelData> {
  const data = getCmsRecord(value);
  const benefits = parseBenefits(data?.benefits);
  const mark = getCmsString(data, "mark");
  const tagline = getCmsString(data, "tagline");
  const title = getCmsString(data, "title");
  const viewAll = parseLink(data?.viewAll);
  const issues: CmsContractIssue[] = [...benefits.issues, ...viewAll.issues];

  if (benefits.data.length === 0) {
    issues.push({
      message: "At least one valid benefit is required.",
      path: "benefits",
    });
  }

  if (!mark) {
    issues.push({ message: "Mark is missing or empty.", path: "mark" });
  }

  if (!tagline) {
    issues.push({ message: "Tagline is missing or empty.", path: "tagline" });
  }

  if (!title) {
    issues.push({ message: "Title is missing or empty.", path: "title" });
  }

  if (!mark || !tagline || !title || benefits.data.length === 0) {
    return { data: null, issues };
  }

  return {
    data: {
      benefits: benefits.data,
      description: getCmsString(data, "description"),
      eyebrow: getCmsString(data, "eyebrow"),
      mark,
      tagline,
      title,
      viewAll: viewAll.data,
    },
    issues,
  };
}
