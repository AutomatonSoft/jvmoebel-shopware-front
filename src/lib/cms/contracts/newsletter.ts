import {
  resolveCmsButtonSize,
  type CmsButtonSize,
} from "@/lib/cms/button-size";
import {
  getCmsRecord,
  getCmsString,
  type CmsDataRecord,
} from "@/lib/cms/contracts/parsing";

export type CmsNewsletterData = Readonly<{
  buttonLabel: string;
  buttonSize: CmsButtonSize;
  description: string;
  errorMessage: string;
  eyebrow?: string;
  invalidEmailMessage: string;
  placeholder: string;
  storefrontUrl: string;
  successMessage: string;
  title: string;
}>;

function getHttpUrl(record: CmsDataRecord | undefined, key: string) {
  const value = getCmsString(record, key);

  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:"
      ? value
      : undefined;
  } catch {
    return undefined;
  }
}

export function parseCmsNewsletterData(
  value: unknown,
): CmsNewsletterData | null {
  const data = getCmsRecord(value);
  const buttonLabel = getCmsString(data, "buttonLabel");
  const description = getCmsString(data, "description");
  const errorMessage = getCmsString(data, "errorMessage");
  const invalidEmailMessage = getCmsString(data, "invalidEmailMessage");
  const placeholder = getCmsString(data, "placeholder");
  const storefrontUrl = getHttpUrl(data, "storefrontUrl");
  const successMessage = getCmsString(data, "successMessage");
  const title = getCmsString(data, "title");

  if (
    !buttonLabel ||
    !description ||
    !errorMessage ||
    !invalidEmailMessage ||
    !placeholder ||
    !storefrontUrl ||
    !successMessage ||
    !title
  ) {
    return null;
  }

  return {
    buttonLabel,
    buttonSize: resolveCmsButtonSize(data?.buttonSize),
    description,
    errorMessage,
    eyebrow: getCmsString(data, "eyebrow"),
    invalidEmailMessage,
    placeholder,
    storefrontUrl,
    successMessage,
    title,
  };
}
