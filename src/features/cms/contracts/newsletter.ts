import {
  resolveCmsButtonSize,
  type CmsButtonSize,
} from "@/features/cms/model/button-size";
import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsNewsletterData = Readonly<{
  buttonLabel: string;
  buttonSize: CmsButtonSize;
  description: string;
  errorMessage: string;
  eyebrow?: string;
  invalidEmailMessage: string;
  placeholder: string;
  successMessage: string;
  title: string;
}>;

export function parseCmsNewsletterData(
  value: unknown,
): CmsContractResult<CmsNewsletterData> {
  const data = getCmsRecord(value);
  const buttonLabel = getCmsString(data, "buttonLabel");
  const description = getCmsString(data, "description");
  const errorMessage = getCmsString(data, "errorMessage");
  const invalidEmailMessage = getCmsString(data, "invalidEmailMessage");
  const placeholder = getCmsString(data, "placeholder");
  const successMessage = getCmsString(data, "successMessage");
  const title = getCmsString(data, "title");
  const issues: CmsContractIssue[] = [];

  const requiredStrings = [
    ["buttonLabel", buttonLabel],
    ["description", description],
    ["errorMessage", errorMessage],
    ["invalidEmailMessage", invalidEmailMessage],
    ["placeholder", placeholder],
    ["successMessage", successMessage],
    ["title", title],
  ] as const;

  for (const [path, fieldValue] of requiredStrings) {
    if (!fieldValue) {
      issues.push({
        message: "Required newsletter field is missing or empty.",
        path,
      });
    }
  }

  if (
    !buttonLabel ||
    !description ||
    !errorMessage ||
    !invalidEmailMessage ||
    !placeholder ||
    !successMessage ||
    !title
  ) {
    return { data: null, issues };
  }

  return {
    data: {
      buttonLabel,
      buttonSize: resolveCmsButtonSize(data?.buttonSize),
      description,
      errorMessage,
      eyebrow: getCmsString(data, "eyebrow"),
      invalidEmailMessage,
      placeholder,
      successMessage,
      title,
    },
    issues,
  };
}
