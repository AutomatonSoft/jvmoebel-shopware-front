import {
  getCmsNumber,
  getCmsRecord,
  getCmsString,
} from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsOfferRailItem = Readonly<{
  ctaLabel: string;
  id: string;
  image: Readonly<{ alt: string; url: string }>;
  position: number;
  subtitle?: string;
  title: string;
  url: string;
  endsAt?: string;
  legalText?: string;
}>;

export type CmsOfferRailData = Readonly<{
  ariaLabel: string;
  description?: string;
  eyebrow?: string;
  offers: readonly CmsOfferRailItem[];
  title: string;
}>;

const isoTimestampWithTimezonePattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/i;

function parseEndsAt(
  offer: ReturnType<typeof getCmsRecord>,
  path: string,
  issues: CmsContractIssue[],
) {
  const endsAt = getCmsString(offer, "endsAt");

  if (!endsAt) {
    return undefined;
  }

  if (
    !isoTimestampWithTimezonePattern.test(endsAt) ||
    !Number.isFinite(Date.parse(endsAt))
  ) {
    issues.push({
      message: "Offer end date must be an ISO timestamp with a timezone.",
      path: `${path}.endsAt`,
    });

    return undefined;
  }

  return endsAt;
}

function parseOffers(value: unknown): Readonly<{
  data: CmsOfferRailItem[];
  issues: readonly CmsContractIssue[];
}> {
  const offersRecord = getCmsRecord(value);
  const offerEntries = Array.isArray(value)
    ? value.map((offer, index) => [String(index), offer] as const)
    : offersRecord
      ? Object.entries(offersRecord)
      : [];
  const issues: CmsContractIssue[] = [];

  const offers = offerEntries
    .flatMap(([key, offerValue], index) => {
      const offer = getCmsRecord(offerValue);
      const image = getCmsRecord(offer?.image);
      const imageUrl = getCmsString(image, "url");
      const title = getCmsString(offer, "title");
      const url = getCmsString(offer, "url");
      const ctaLabel = getCmsString(offer, "ctaLabel");
      const path = `offers.${key}`;
      const missingFields = [
        !imageUrl && "image.url",
        !title && "title",
        !url && "url",
        !ctaLabel && "ctaLabel",
      ].filter((field): field is string => Boolean(field));

      if (!imageUrl || !title || !url || !ctaLabel) {
        issues.push({
          message: `Offer is missing required fields: ${missingFields.join(", ")}.`,
          path,
        });

        return [];
      }

      return [
        {
          ctaLabel,
          endsAt: parseEndsAt(offer, path, issues),
          id: getCmsString(offer, "id") || `${title}-${index}`,
          image: {
            alt: getCmsString(image, "alt") || title,
            url: imageUrl,
          },
          legalText: getCmsString(offer, "legalText"),
          position: getCmsNumber(offer, "position") ?? index,
          subtitle: getCmsString(offer, "subtitle"),
          title,
          url,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);

  return { data: offers, issues };
}

export function parseCmsOfferRailData(
  value: unknown,
): CmsContractResult<CmsOfferRailData> {
  const data = getCmsRecord(value);
  const offers = parseOffers(data?.offers);
  const title = getCmsString(data, "title");
  const issues: CmsContractIssue[] = [...offers.issues];

  if (!title) {
    issues.push({ message: "Title is missing or empty.", path: "title" });
  }

  if (offers.data.length === 0) {
    issues.push({
      message: "At least one valid offer is required.",
      path: "offers",
    });
  }

  if (!title || offers.data.length === 0) {
    return { data: null, issues };
  }

  return {
    data: {
      ariaLabel: getCmsString(data, "ariaLabel") || title,
      description: getCmsString(data, "description"),
      eyebrow: getCmsString(data, "eyebrow"),
      offers: offers.data,
      title,
    },
    issues,
  };
}
