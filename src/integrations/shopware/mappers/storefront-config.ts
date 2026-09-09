import { defaultStorefrontFooterContent } from "@/features/storefront-shell/fixtures/footer";
import type {
  StorefrontFooterLink,
  StorefrontFooterMedia,
  StorefrontFooterPaymentMethod,
} from "@/features/storefront-shell/model/footer";
import type { StoreNavigationItem } from "@/features/storefront-shell/model/navigation";
import type {
  StorefrontConfigIssue,
  StorefrontConfigResult,
} from "@/features/storefront-shell/model/storefront-config";
import { parseStorefrontBranding } from "@/integrations/shopware/mappers/storefront-branding";

type DataRecord = Record<string, unknown>;

function getRecord(value: unknown): DataRecord | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }

  return value as DataRecord;
}

function getString(record: DataRecord | undefined, key: string) {
  const value = record?.[key];

  return typeof value === "string" && value.trim() ? value : undefined;
}

function getNumber(record: DataRecord | undefined, key: string) {
  const value = record?.[key];

  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function getBoolean(record: DataRecord | undefined, key: string) {
  const value = record?.[key];

  return typeof value === "boolean" ? value : undefined;
}

function getSafeUrl(value: string | undefined, allowRelative: boolean) {
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

function getRequiredString(
  record: DataRecord | undefined,
  key: string,
  fallback: string,
  path: string,
  issues: StorefrontConfigIssue[],
) {
  const value = getString(record, key);

  if (!value) {
    issues.push({ message: "Value must be a non-empty string.", path });
  }

  return value ?? fallback;
}

function getOptionalString(
  record: DataRecord | undefined,
  key: string,
  fallback: string,
) {
  return getString(record, key) ?? fallback;
}

function parseNavigation(
  value: unknown,
  path: string,
  issues: StorefrontConfigIssue[],
): StoreNavigationItem[] {
  if (!Array.isArray(value)) {
    issues.push({ message: "Navigation must be an array.", path });
    return [];
  }

  const result: StoreNavigationItem[] = [];
  const ids = new Set<string>();

  value.forEach((itemValue, index) => {
    const itemPath = `${path}[${index}]`;
    const item = getRecord(itemValue);
    const id = getString(item, "id");
    const label = getString(item, "label");
    const href = getSafeUrl(getString(item, "href"), true);

    if (!id || ids.has(id)) {
      issues.push({
        message: "Navigation ID must be a unique non-empty string.",
        path: `${itemPath}.id`,
      });
    }

    if (!label) {
      issues.push({
        message: "Navigation label must be a non-empty string.",
        path: `${itemPath}.label`,
      });
    }

    if (!href) {
      issues.push({
        message: "Navigation URL must be root-relative or use HTTP or HTTPS.",
        path: `${itemPath}.href`,
      });
    }

    const children = parseNavigation(
      item?.children,
      `${itemPath}.children`,
      issues,
    );

    if (!id || ids.has(id) || !label || !href) {
      return;
    }

    const childCount = getNumber(item, "childCount");
    const type = getString(item, "type");
    const validType =
      type === "folder" || type === "link" || type === "page"
        ? type
        : undefined;

    if (childCount !== undefined && childCount < 0) {
      issues.push({
        message: "Navigation childCount must not be negative.",
        path: `${itemPath}.childCount`,
      });
    }

    if (type && !validType) {
      issues.push({
        message: "Navigation type must be folder, link, or page.",
        path: `${itemPath}.type`,
      });
    }

    ids.add(id);
    result.push({
      ...(childCount !== undefined && childCount >= 0
        ? { childCount: Math.max(childCount, children.length) }
        : {}),
      children,
      href,
      id,
      label,
      ...(validType ? { type: validType } : {}),
    });
  });

  return result;
}

function parseMedia(
  value: unknown,
  fallbackAlt: string,
  path: string,
  issues: StorefrontConfigIssue[],
): StorefrontFooterMedia | undefined {
  const media = getRecord(value);
  const url = getSafeUrl(getString(media, "url"), true);

  if (!url) {
    issues.push({
      message: "Media URL must be root-relative or use HTTP or HTTPS.",
      path: `${path}.url`,
    });
    return undefined;
  }

  return {
    alt: getString(media, "alt") ?? fallbackAlt,
    url,
  };
}

function parsePaymentMethods(
  value: unknown,
  issues: StorefrontConfigIssue[],
): StorefrontFooterPaymentMethod[] {
  if (!Array.isArray(value)) {
    issues.push({
      message: "Payment badges must be an array.",
      path: "footer.paymentBadges",
    });
    return [...defaultStorefrontFooterContent.paymentMethods];
  }

  const ids = new Set<string>();
  const result: Array<StorefrontFooterPaymentMethod & { position: number }> =
    [];

  value.forEach((itemValue, index) => {
    const path = `footer.paymentBadges[${index}]`;
    const item = getRecord(itemValue);
    const id = getString(item, "id");
    const label = getString(item, "label");
    const position = getNumber(item, "position") ?? index;

    if (!id || ids.has(id)) {
      issues.push({
        message: "Payment badge ID must be a unique non-empty string.",
        path: `${path}.id`,
      });
      return;
    }

    if (!label) {
      issues.push({
        message: "Payment badge label must be a non-empty string.",
        path: `${path}.label`,
      });
      return;
    }

    const media = parseMedia(item?.icon, label, `${path}.icon`, issues);

    if (!media) {
      return;
    }

    ids.add(id);
    result.push({ id, label, media, position });
  });

  return result
    .sort((first, second) => first.position - second.position)
    .map(({ id, label, media }) => ({ id, label, media }));
}

function parseSocialLinks(
  value: unknown,
  issues: StorefrontConfigIssue[],
): StorefrontFooterLink[] {
  if (!Array.isArray(value)) {
    issues.push({
      message: "Social links must be an array.",
      path: "footer.socialLinks",
    });
    return [...defaultStorefrontFooterContent.socialLinks];
  }

  const ids = new Set<string>();
  const result: Array<StorefrontFooterLink & { position: number }> = [];

  value.forEach((itemValue, index) => {
    const path = `footer.socialLinks[${index}]`;
    const item = getRecord(itemValue);
    const id = getString(item, "id");
    const label = getString(item, "label");
    const url = getSafeUrl(getString(item, "url"), false);
    const position = getNumber(item, "position") ?? index;

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

    const media = parseMedia(item?.icon, label, `${path}.icon`, issues);

    if (!media) {
      return;
    }

    ids.add(id);
    result.push({
      id,
      label,
      media,
      openInNewTab: getBoolean(item, "openInNewTab") ?? true,
      position,
      url,
    });
  });

  return result
    .sort((first, second) => first.position - second.position)
    .map(({ id, label, media, openInNewTab, url }) => ({
      id,
      label,
      media,
      openInNewTab,
      url,
    }));
}

export function parseShopwareStorefrontConfig(
  value: unknown,
): StorefrontConfigResult {
  const issues: StorefrontConfigIssue[] = [];
  const root = getRecord(value);
  const header = getRecord(root?.header);
  const footer = getRecord(root?.footer);
  const branding = getRecord(header?.branding);

  if (!root) {
    issues.push({
      message: "Storefront configuration must be an object.",
      path: "storefrontConfig",
    });
  }

  if (!header) {
    issues.push({ message: "Header must be an object.", path: "header" });
  }

  if (!footer) {
    issues.push({ message: "Footer must be an object.", path: "footer" });
  }

  if (!branding) {
    issues.push({
      message: "Header branding must be an object.",
      path: "header.branding",
    });
  }

  const brandingResult = parseStorefrontBranding({
    jvStorefrontBranding: branding,
  });

  issues.push(
    ...brandingResult.issues.map((issue) => ({
      message: issue.message,
      path: issue.path.replace("jvStorefrontBranding", "header.branding"),
    })),
  );

  const footerAbout = getRecord(footer?.about);
  const footerHeadings = getRecord(footer?.headings);
  const footerRevocation = getRecord(footer?.revocation);
  const defaultAbout = defaultStorefrontFooterContent.about;
  const defaultHeadings = defaultStorefrontFooterContent.headings;
  const defaultRevocation = defaultStorefrontFooterContent.revocation;
  const recipientEmail = getString(footerRevocation, "recipientEmail");
  const validRecipient =
    recipientEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail);

  if (!validRecipient) {
    issues.push({
      message: "Revocation recipientEmail must be a valid email address.",
      path: "footer.revocation.recipientEmail",
    });
  }

  return {
    data: {
      branding: brandingResult.data,
      footerContent: {
        about: {
          description: getRequiredString(
            footerAbout,
            "description",
            defaultAbout.description,
            "footer.about.description",
            issues,
          ),
          eyebrow: getRequiredString(
            footerAbout,
            "eyebrow",
            defaultAbout.eyebrow,
            "footer.about.eyebrow",
            issues,
          ),
          title: getRequiredString(
            footerAbout,
            "title",
            defaultAbout.title,
            "footer.about.title",
            issues,
          ),
        },
        copyright: getRequiredString(
          footer,
          "copyrightText",
          defaultStorefrontFooterContent.copyright,
          "footer.copyrightText",
          issues,
        ),
        headings: {
          categories: getOptionalString(
            footerHeadings,
            "categories",
            defaultHeadings.categories,
          ),
          paymentMethods: getOptionalString(
            footerHeadings,
            "paymentMethods",
            defaultHeadings.paymentMethods,
          ),
          service: getOptionalString(
            footerHeadings,
            "service",
            defaultHeadings.service,
          ),
          socialLinks: getOptionalString(
            footerHeadings,
            "socialLinks",
            defaultHeadings.socialLinks,
          ),
        },
        paymentMethods: parsePaymentMethods(footer?.paymentBadges, issues),
        revocation: {
          buttonLabel: getRequiredString(
            footerRevocation,
            "buttonLabel",
            defaultRevocation.buttonLabel,
            "footer.revocation.buttonLabel",
            issues,
          ),
          description: getOptionalString(
            footerRevocation,
            "description",
            defaultRevocation.description,
          ),
          disclaimer: getOptionalString(
            footerRevocation,
            "disclaimer",
            defaultRevocation.disclaimer,
          ),
          enabled:
            getBoolean(footerRevocation, "enabled") ??
            defaultRevocation.enabled,
          recipient: validRecipient
            ? recipientEmail
            : defaultRevocation.recipient,
          submitLabel: getOptionalString(
            footerRevocation,
            "submitLabel",
            defaultRevocation.submitLabel,
          ),
          title: getOptionalString(
            footerRevocation,
            "title",
            defaultRevocation.title,
          ),
        },
        socialLinks: parseSocialLinks(footer?.socialLinks, issues),
      },
      footerNavigation: parseNavigation(
        footer?.categoryNavigation,
        "footer.categoryNavigation",
        issues,
      ),
      navigation: parseNavigation(
        header?.navigation,
        "header.navigation",
        issues,
      ),
      serviceNavigation: parseNavigation(
        footer?.serviceNavigation,
        "footer.serviceNavigation",
        issues,
      ),
    },
    issues,
  };
}
