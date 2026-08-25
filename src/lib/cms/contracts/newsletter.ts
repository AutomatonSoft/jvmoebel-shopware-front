import {
  resolveCmsButtonSize,
  type CmsButtonSize,
} from "@/lib/cms/button-size";

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

function getRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

function getString(record: Record<string, unknown> | undefined, key: string) {
  const value = record?.[key];

  return typeof value === "string" && value.trim() ? value : undefined;
}

function getHttpUrl(record: Record<string, unknown> | undefined, key: string) {
  const value = getString(record, key);

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
  const data = getRecord(value);
  const buttonLabel = getString(data, "buttonLabel");
  const description = getString(data, "description");
  const errorMessage = getString(data, "errorMessage");
  const invalidEmailMessage = getString(data, "invalidEmailMessage");
  const placeholder = getString(data, "placeholder");
  const storefrontUrl = getHttpUrl(data, "storefrontUrl");
  const successMessage = getString(data, "successMessage");
  const title = getString(data, "title");

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
    eyebrow: getString(data, "eyebrow"),
    invalidEmailMessage,
    placeholder,
    storefrontUrl,
    successMessage,
    title,
  };
}
