import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type { CmsContractResult } from "@/features/cms/contracts/result";

export type CmsContactFormData = Readonly<{
  title: string;
}>;

export function parseCmsContactFormData(
  value: unknown,
): CmsContractResult<CmsContactFormData> {
  const config = getCmsRecord(value);
  const type = getCmsString(getCmsRecord(config?.type), "value");

  if (type !== "contact") {
    return {
      data: null,
      issues: [
        {
          message: "The CMS form element must use the contact form type.",
          path: "type.value",
        },
      ],
    };
  }

  return {
    data: {
      title: getCmsString(getCmsRecord(config?.title), "value") ?? "Kontakt",
    },
    issues: [],
  };
}
