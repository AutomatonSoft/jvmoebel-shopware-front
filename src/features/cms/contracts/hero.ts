import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";
import {
  resolveCmsButtonSize,
  type CmsButtonSize,
} from "@/features/cms/model/button-size";

const DEFAULT_AUTOPLAY_INTERVAL_MS = 7000;
const MIN_AUTOPLAY_INTERVAL_MS = 4000;
const MAX_AUTOPLAY_INTERVAL_MS = 15000;

export type CmsHeroImage = Readonly<{
  alt: string;
  url: string;
}>;

export type CmsHeroLink = Readonly<{
  label: string;
  size: CmsButtonSize;
  url: string;
}>;

export type CmsHeroPromotion = Readonly<{
  label?: string;
  value: string;
}>;

export type CmsHeroSlideLayout = "caption" | "featured";

export type CmsHeroSlide = Readonly<{
  description?: string;
  eyebrow?: string;
  id: string;
  image: CmsHeroImage;
  layout: CmsHeroSlideLayout;
  position: number;
  primaryLink?: CmsHeroLink;
  promotion?: CmsHeroPromotion;
  secondaryLink?: CmsHeroLink;
  title: string;
  url?: string;
}>;

export type CmsHeroData = Readonly<{
  ariaLabel?: string;
  autoplay: boolean;
  autoplayIntervalMs: number;
  slides: readonly CmsHeroSlide[];
}>;

function getNestedPath(path: string, field: string) {
  return path ? `${path}.${field}` : field;
}

function parseLink(
  value: unknown,
  path: string,
): Readonly<{
  data?: CmsHeroLink;
  issues: readonly CmsContractIssue[];
}> {
  if (value === undefined || value === null) {
    return { issues: [] };
  }

  const link = getCmsRecord(value);
  const label = getCmsString(link, "label");
  const url = getCmsString(link, "url");
  const issues: CmsContractIssue[] = [];

  if (!label) {
    issues.push({
      message: "Link label is missing or empty.",
      path: getNestedPath(path, "label"),
    });
  }

  if (!url) {
    issues.push({
      message: "Link URL is missing or empty.",
      path: getNestedPath(path, "url"),
    });
  }

  if (!label || !url) {
    return { issues };
  }

  return {
    data: {
      label,
      size: resolveCmsButtonSize(link?.size),
      url,
    },
    issues,
  };
}

function parsePromotion(
  value: unknown,
  path: string,
): Readonly<{
  data?: CmsHeroPromotion;
  issues: readonly CmsContractIssue[];
}> {
  if (value === undefined || value === null) {
    return { issues: [] };
  }

  const promotion = getCmsRecord(value);
  const promotionValue = getCmsString(promotion, "value");

  if (!promotionValue) {
    return {
      issues: [
        {
          message: "Promotion value is missing or empty.",
          path: getNestedPath(path, "value"),
        },
      ],
    };
  }

  return {
    data: {
      label: getCmsString(promotion, "label"),
      value: promotionValue,
    },
    issues: [],
  };
}

function parseSlide(
  value: unknown,
  path: string,
  index: number,
  requirePosition = false,
): Readonly<{
  data?: CmsHeroSlide;
  issues: readonly CmsContractIssue[];
}> {
  const slide = getCmsRecord(value);
  const image = getCmsRecord(slide?.image);
  const title = getCmsString(slide, "title");
  const imageUrl = getCmsString(image, "url");
  const primaryLink = parseLink(
    slide?.primaryLink,
    getNestedPath(path, "primaryLink"),
  );
  const secondaryLink = parseLink(
    slide?.secondaryLink,
    getNestedPath(path, "secondaryLink"),
  );
  const promotion = parsePromotion(
    slide?.promotion,
    getNestedPath(path, "promotion"),
  );
  const position = slide?.position;
  const hasValidPosition =
    typeof position === "number" && Number.isInteger(position) && position >= 0;
  const issues: CmsContractIssue[] = [
    ...primaryLink.issues,
    ...secondaryLink.issues,
    ...promotion.issues,
  ];

  if (!title) {
    issues.push({
      message: "Hero title is missing or empty.",
      path: getNestedPath(path, "title"),
    });
  }

  if (!imageUrl) {
    issues.push({
      message: "Hero image URL is missing or empty.",
      path: getNestedPath(path, "image.url"),
    });
  }

  if (requirePosition && !hasValidPosition) {
    issues.push({
      message: "Hero slide position must be a non-negative integer.",
      path: getNestedPath(path, "position"),
    });
  }

  if (!title || !imageUrl || (requirePosition && !hasValidPosition)) {
    return { issues };
  }

  return {
    data: {
      description: getCmsString(slide, "description"),
      eyebrow: getCmsString(slide, "eyebrow"),
      id: getCmsString(slide, "id") || `hero-slide-${index + 1}`,
      image: {
        alt: getCmsString(image, "alt") || "",
        url: imageUrl,
      },
      layout: slide?.layout === "caption" ? "caption" : "featured",
      position: hasValidPosition ? position : index,
      primaryLink: primaryLink.data,
      promotion: promotion.data,
      secondaryLink: secondaryLink.data,
      title,
      url: getCmsString(slide, "url"),
    },
    issues,
  };
}

function parseSlides(value: unknown): Readonly<{
  data: CmsHeroSlide[];
  issues: readonly CmsContractIssue[];
}> {
  const slidesRecord = getCmsRecord(value);
  const slideEntries = Array.isArray(value)
    ? value.map((slide, index) => [String(index), slide] as const)
    : slidesRecord
      ? Object.entries(slidesRecord)
      : [];
  const issues: CmsContractIssue[] = [];
  const usedPositions = new Set<number>();

  const slides = slideEntries
    .flatMap(([key, slide], index) => {
      const path = `slides.${key}`;
      const result = parseSlide(slide, path, index, true);

      issues.push(...result.issues);

      if (!result.data) {
        return [];
      }

      if (usedPositions.has(result.data.position)) {
        issues.push({
          message: "Hero slide position must be unique.",
          path: getNestedPath(path, "position"),
        });

        return [];
      }

      usedPositions.add(result.data.position);

      return [result.data];
    })
    .sort((first, second) => first.position - second.position);

  return { data: slides, issues };
}

function resolveAutoplay(value: unknown) {
  return value !== false && value !== 0;
}

function resolveAutoplayInterval(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_AUTOPLAY_INTERVAL_MS;
  }

  return Math.min(
    MAX_AUTOPLAY_INTERVAL_MS,
    Math.max(MIN_AUTOPLAY_INTERVAL_MS, Math.round(value)),
  );
}

export function parseCmsHeroData(
  value: unknown,
): CmsContractResult<CmsHeroData> {
  const data = getCmsRecord(value);
  const hasSlides = Boolean(data && Object.hasOwn(data, "slides"));
  const parsedSlides = hasSlides
    ? parseSlides(data?.slides)
    : (() => {
        const legacySlide = parseSlide(value, "", 0);

        return {
          data: legacySlide.data ? [legacySlide.data] : [],
          issues: legacySlide.issues,
        };
      })();
  const issues: CmsContractIssue[] = [...parsedSlides.issues];

  if (parsedSlides.data.length === 0) {
    issues.push({
      message: "At least one valid hero slide is required.",
      path: "slides",
    });

    return { data: null, issues };
  }

  return {
    data: {
      ariaLabel: getCmsString(data, "ariaLabel"),
      autoplay: resolveAutoplay(data?.autoplay),
      autoplayIntervalMs: resolveAutoplayInterval(data?.autoplayIntervalMs),
      slides: parsedSlides.data,
    },
    issues,
  };
}
