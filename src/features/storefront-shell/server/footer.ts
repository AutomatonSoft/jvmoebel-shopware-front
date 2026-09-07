import "server-only";

import { parseCmsFooterData } from "@/features/cms/contracts/footer";
import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type { CmsPage, CmsSlot } from "@/features/cms/model/page";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";
import { defaultStorefrontFooterContent } from "@/features/storefront-shell/fixtures/footer";
import type { StorefrontFooterContent } from "@/features/storefront-shell/model/footer";
import { getShopwareCmsPage } from "@/integrations/shopware/cms";
import { getShopwareContext } from "@/integrations/shopware/context";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

const shopwareIdPattern = /^[0-9a-f]{32}$/i;

function getFooterSlot(page: CmsPage): CmsSlot | undefined {
  return page.sections
    .flatMap((section) => section.blocks)
    .flatMap((block) => block.slots)
    .find((slot) => slot.type === "jv-footer");
}

function reportFooterCmsIssue(message: string, cause?: unknown) {
  console.error("Storefront footer CMS issue.", {
    ...(cause instanceof Error ? { cause: cause.message } : {}),
    message,
  });
}

export async function getStorefrontFooterContent(): Promise<StorefrontFooterContent> {
  if (shouldUseShopwareMocks()) {
    return defaultStorefrontFooterContent;
  }

  const client = getShopwareRequestSession().client;
  const context = await getShopwareContext(client);
  const configuration = getCmsRecord(context.salesChannel.configuration);
  const pageId = getCmsString(configuration, "jvStorefrontFooterCmsPageId");

  if (!pageId) {
    return defaultStorefrontFooterContent;
  }

  if (!shopwareIdPattern.test(pageId)) {
    reportFooterCmsIssue(
      "jvStorefrontFooterCmsPageId must be a 32-character Shopware ID.",
    );
    return defaultStorefrontFooterContent;
  }

  try {
    const page = await getShopwareCmsPage({ client, id: pageId });
    const slot = getFooterSlot(page);

    if (!slot) {
      reportFooterCmsIssue(
        `CMS page ${pageId} does not contain a jv-footer element.`,
      );
      return defaultStorefrontFooterContent;
    }

    const result = parseCmsFooterData(slot.data);

    reportCmsContractIssues(slot, result.issues);

    return result.data ?? defaultStorefrontFooterContent;
  } catch (error) {
    reportFooterCmsIssue(`Failed to load footer CMS page ${pageId}.`, error);
    return defaultStorefrontFooterContent;
  }
}
