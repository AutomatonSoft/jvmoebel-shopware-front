import {
  getCmsNumber,
  getCmsRecord,
  getCmsString,
  type CmsDataRecord,
} from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";
import type { CmsSlot } from "@/features/cms/model/page";

export type CmsImageDisplayMode = "contain" | "cover" | "standard" | "stretch";

export type CmsImageAlignment = "center" | "flex-end" | "flex-start";

export type CmsImageData = Readonly<{
  ariaLabel?: string;
  displayMode: CmsImageDisplayMode;
  fetchPriorityHigh: boolean;
  horizontalAlign: CmsImageAlignment;
  image: Readonly<{
    alt: string;
    height?: number;
    title?: string;
    url: string;
    width?: number;
  }>;
  isDecorative: boolean;
  link?: Readonly<{
    newTab: boolean;
    url: string;
  }>;
  minHeight?: string;
  verticalAlign: CmsImageAlignment;
}>;

function getConfigValue(config: CmsDataRecord | undefined, key: string) {
  return getCmsRecord(config?.[key])?.value;
}

function getConfigString(config: CmsDataRecord | undefined, key: string) {
  const value = getConfigValue(config, key);

  return typeof value === "string" && value.trim() ? value : undefined;
}

function getConfigBoolean(config: CmsDataRecord | undefined, key: string) {
  return getConfigValue(config, key) === true;
}

function getPositiveDimension(
  metadata: CmsDataRecord | undefined,
  media: CmsDataRecord | undefined,
  key: "height" | "width",
) {
  const value = getCmsNumber(metadata, key) ?? getCmsNumber(media, key);

  return value && value > 0 ? Math.round(value) : undefined;
}

function resolveDisplayMode(value: unknown): CmsImageDisplayMode {
  return value === "contain" || value === "cover" || value === "stretch"
    ? value
    : "standard";
}

function resolveAlignment(value: unknown): CmsImageAlignment {
  return value === "flex-start" || value === "flex-end" ? value : "center";
}

function isImageUrl(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isLinkUrl(value: string) {
  if (
    value.startsWith("#") ||
    (value.startsWith("/") && !value.startsWith("//"))
  ) {
    return true;
  }

  try {
    const url = new URL(value);

    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol);
  } catch {
    return false;
  }
}

export function parseCmsImageData(
  slot: Pick<CmsSlot, "config" | "data">,
): CmsContractResult<CmsImageData> {
  const data = getCmsRecord(slot.data);
  const media = getCmsRecord(data?.media);
  const translated = getCmsRecord(media?.translated);
  const metadata = getCmsRecord(media?.metaData);
  const config = getCmsRecord(slot.config);
  const imageUrl = getCmsString(media, "url");
  const linkUrl = getConfigString(config, "url");
  const issues: CmsContractIssue[] = [];

  if (!imageUrl || !isImageUrl(imageUrl)) {
    issues.push({
      message: "Resolved image URL is missing or unsupported.",
      path: "data.media.url",
    });

    return { data: null, issues };
  }

  if (linkUrl && !isLinkUrl(linkUrl)) {
    issues.push({
      message: "Image link URL uses an unsupported protocol.",
      path: "config.url.value",
    });
  }

  const isDecorative = getConfigBoolean(config, "isDecorative");
  const alt =
    getCmsString(translated, "alt") || getCmsString(media, "alt") || "";
  const title =
    getCmsString(translated, "title") || getCmsString(media, "title");

  return {
    data: {
      ariaLabel: getConfigString(config, "ariaLabel"),
      displayMode: resolveDisplayMode(getConfigValue(config, "displayMode")),
      fetchPriorityHigh: getConfigBoolean(config, "fetchPriorityHigh"),
      horizontalAlign: resolveAlignment(
        getConfigValue(config, "horizontalAlign"),
      ),
      image: {
        alt: isDecorative ? "" : alt,
        height: getPositiveDimension(metadata, media, "height"),
        title: isDecorative ? undefined : title,
        url: imageUrl,
        width: getPositiveDimension(metadata, media, "width"),
      },
      isDecorative,
      link:
        linkUrl && isLinkUrl(linkUrl)
          ? {
              newTab: getConfigBoolean(config, "newTab"),
              url: linkUrl,
            }
          : undefined,
      minHeight: getConfigString(config, "minHeight"),
      verticalAlign: resolveAlignment(getConfigValue(config, "verticalAlign")),
    },
    issues,
  };
}
