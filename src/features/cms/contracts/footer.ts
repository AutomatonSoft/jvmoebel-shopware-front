import {
  getCmsRecord,
  getCmsString,
  type CmsDataRecord,
} from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";
import type {
  StorefrontFooterContent,
  StorefrontFooterLink,
  StorefrontFooterMedia,
  StorefrontFooterPaymentMethod,
} from "@/features/storefront-shell/model/footer";

function getCollection(value: unknown): unknown[] | undefined {
  if (Array.isArray(value)) {
    return value;
  }

  const record = getCmsRecord(value);

  return record ? Object.values(record) : undefined;
}

function getUrl(value: string | undefined, allowRelative: boolean) {
  if (!value) {
    return undefined;
  }

  if (allowRelative && value.startsWith("/") && !value.startsWith("//")) {
    return value;
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

function parseMedia(
  value: unknown,
  fallbackAlt: string,
  path: string,
  issues: CmsContractIssue[],
): StorefrontFooterMedia | undefined {
  const media = getCmsRecord(value);
  const url = getUrl(getCmsString(media, "url"), true);

  if (!url) {
    issues.push({
      message: "Media URL must be root-relative or use HTTP or HTTPS.",
      path: `${path}.url`,
    });
    return undefined;
  }

  return {
    alt: getCmsString(media, "alt") || fallbackAlt,
    url,
  };
}

function parsePaymentMethods(
  value: unknown,
  issues: CmsContractIssue[],
): StorefrontFooterPaymentMethod[] | undefined {
  const items = getCollection(value);

  if (!items) {
    issues.push({
      message: "Payment methods must be an array or keyed object.",
      path: "paymentMethods",
    });
    return undefined;
  }

  const result: StorefrontFooterPaymentMethod[] = [];
  const ids = new Set<string>();

  items.forEach((value, index) => {
    const path = `paymentMethods[${index}]`;
    const item = getCmsRecord(value);
    const id = getCmsString(item, "id");
    const label = getCmsString(item, "label");

    if (!id || ids.has(id)) {
      issues.push({
        message: "Payment method ID must be a unique non-empty string.",
        path: `${path}.id`,
      });
      return;
    }

    if (!label) {
      issues.push({
        message: "Payment method label must be a non-empty string.",
        path: `${path}.label`,
      });
      return;
    }

    const media = parseMedia(item?.media, label, `${path}.media`, issues);

    if (!media) {
      return;
    }

    ids.add(id);
    result.push({ id, label, media });
  });

  return result;
}

function parseSocialLinks(
  value: unknown,
  issues: CmsContractIssue[],
): StorefrontFooterLink[] | undefined {
  const items = getCollection(value);

  if (!items) {
    issues.push({
      message: "Social links must be an array or keyed object.",
      path: "socialLinks",
    });
    return undefined;
  }

  const result: StorefrontFooterLink[] = [];
  const ids = new Set<string>();

  items.forEach((value, index) => {
    const path = `socialLinks[${index}]`;
    const item = getCmsRecord(value);
    const id = getCmsString(item, "id");
    const label = getCmsString(item, "label");
    const url = getUrl(getCmsString(item, "url"), false);

    if (!id || ids.has(id)) {
      issues.push({
        message: "Social link ID must be a unique non-empty string.",
        path: `${path}.id`,
      });
      return;
    }

    if (!label) {
      issues.push({
        message: "Social link label must be a non-empty string.",
        path: `${path}.label`,
      });
      return;
    }

    if (!url) {
      issues.push({
        message: "Social link URL must use HTTP or HTTPS.",
        path: `${path}.url`,
      });
      return;
    }

    const media = parseMedia(item?.media, label, `${path}.media`, issues);

    if (!media) {
      return;
    }

    ids.add(id);
    result.push({ id, label, media, url });
  });

  return result;
}

function requireString(
  record: CmsDataRecord | undefined,
  key: string,
  path: string,
  issues: CmsContractIssue[],
) {
  const value = getCmsString(record, key);

  if (!value) {
    issues.push({
      message: "Value must be a non-empty string.",
      path,
    });
  }

  return value;
}

export function parseCmsFooterData(
  value: unknown,
): CmsContractResult<StorefrontFooterContent> {
  const issues: CmsContractIssue[] = [];
  const data = getCmsRecord(value);
  const about = getCmsRecord(data?.about);
  const headings = getCmsRecord(data?.headings);
  const revocation = getCmsRecord(data?.revocation);
  const aboutDescription = requireString(
    about,
    "description",
    "about.description",
    issues,
  );
  const aboutEyebrow = requireString(about, "eyebrow", "about.eyebrow", issues);
  const aboutTitle = requireString(about, "title", "about.title", issues);
  const copyright = requireString(data, "copyright", "copyright", issues);
  const categoriesHeading = requireString(
    headings,
    "categories",
    "headings.categories",
    issues,
  );
  const paymentMethodsHeading = requireString(
    headings,
    "paymentMethods",
    "headings.paymentMethods",
    issues,
  );
  const serviceHeading = requireString(
    headings,
    "service",
    "headings.service",
    issues,
  );
  const socialLinksHeading = requireString(
    headings,
    "socialLinks",
    "headings.socialLinks",
    issues,
  );
  const revocationButtonLabel = requireString(
    revocation,
    "buttonLabel",
    "revocation.buttonLabel",
    issues,
  );
  const revocationDescription = requireString(
    revocation,
    "description",
    "revocation.description",
    issues,
  );
  const revocationDisclaimer = requireString(
    revocation,
    "disclaimer",
    "revocation.disclaimer",
    issues,
  );
  const revocationRecipient = requireString(
    revocation,
    "recipient",
    "revocation.recipient",
    issues,
  );
  const revocationSubmitLabel = requireString(
    revocation,
    "submitLabel",
    "revocation.submitLabel",
    issues,
  );
  const revocationTitle = requireString(
    revocation,
    "title",
    "revocation.title",
    issues,
  );
  const paymentMethods = parsePaymentMethods(data?.paymentMethods, issues);
  const socialLinks = parseSocialLinks(data?.socialLinks, issues);
  const recipientIsValid =
    revocationRecipient &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(revocationRecipient);

  if (revocationRecipient && !recipientIsValid) {
    issues.push({
      message: "Revocation recipient must be a valid email address.",
      path: "revocation.recipient",
    });
  }

  if (
    !aboutDescription ||
    !aboutEyebrow ||
    !aboutTitle ||
    !copyright ||
    !categoriesHeading ||
    !paymentMethodsHeading ||
    !serviceHeading ||
    !socialLinksHeading ||
    !revocationButtonLabel ||
    !revocationDescription ||
    !revocationDisclaimer ||
    !recipientIsValid ||
    !revocationSubmitLabel ||
    !revocationTitle ||
    !paymentMethods ||
    !socialLinks
  ) {
    return { data: null, issues };
  }

  return {
    data: {
      about: {
        description: aboutDescription,
        eyebrow: aboutEyebrow,
        title: aboutTitle,
      },
      copyright,
      headings: {
        categories: categoriesHeading,
        paymentMethods: paymentMethodsHeading,
        service: serviceHeading,
        socialLinks: socialLinksHeading,
      },
      paymentMethods,
      revocation: {
        buttonLabel: revocationButtonLabel,
        description: revocationDescription,
        disclaimer: revocationDisclaimer,
        recipient: revocationRecipient,
        submitLabel: revocationSubmitLabel,
        title: revocationTitle,
      },
      socialLinks,
    },
    issues,
  };
}
