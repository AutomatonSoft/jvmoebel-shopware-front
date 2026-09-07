import "server-only";

import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type { CmsPage } from "@/features/cms/model/page";
import { discountOffersCmsPageMock } from "@/features/offers/fixtures/discount-offers-page";
import { getShopwareCmsPage } from "@/integrations/shopware/cms";
import { getShopwareContext } from "@/integrations/shopware/context";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

const shopwareIdPattern = /^[0-9a-f]{32}$/i;
const pageIdConfigurationKey = "jvStorefrontDiscountOffersCmsPageId";

function reportOffersCmsIssue(message: string, cause?: unknown) {
  console.error("Discount offers CMS issue.", {
    ...(cause instanceof Error ? { cause: cause.message } : {}),
    message,
  });
}

export async function getDiscountOffersCmsPage(): Promise<CmsPage | null> {
  if (shouldUseShopwareMocks()) {
    return discountOffersCmsPageMock;
  }

  const client = getShopwareRequestSession().client;
  const context = await getShopwareContext(client);
  const configuration = getCmsRecord(context.salesChannel.configuration);
  const pageId = getCmsString(configuration, pageIdConfigurationKey);

  if (!pageId) {
    reportOffersCmsIssue(`${pageIdConfigurationKey} is missing.`);
    return null;
  }

  if (!shopwareIdPattern.test(pageId)) {
    reportOffersCmsIssue(
      `${pageIdConfigurationKey} must be a 32-character Shopware ID.`,
    );
    return null;
  }

  try {
    return await getShopwareCmsPage({ client, id: pageId });
  } catch (error) {
    reportOffersCmsIssue(`Failed to load offers CMS page ${pageId}.`, error);
    return null;
  }
}
