import "server-only";

import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type { CmsPage } from "@/features/cms/model/page";
import { inspirationCmsPageMock } from "@/features/inspiration/fixtures/inspiration-page";
import { getShopwareCmsPage } from "@/integrations/shopware/cms";
import { getShopwareContext } from "@/integrations/shopware/context";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

const shopwareIdPattern = /^[0-9a-f]{32}$/i;
const pageIdConfigurationKey = "jvStorefrontInspirationCmsPageId";

function reportInspirationCmsIssue(message: string, cause?: unknown) {
  console.error("Inspiration CMS issue.", {
    ...(cause instanceof Error ? { cause: cause.message } : {}),
    message,
  });
}

export async function getInspirationCmsPage(): Promise<CmsPage | null> {
  if (shouldUseShopwareMocks()) {
    return inspirationCmsPageMock;
  }

  try {
    const client = getShopwareRequestSession().client;
    const context = await getShopwareContext(client);
    const configuration = getCmsRecord(context.salesChannel.configuration);
    const pageId = getCmsString(configuration, pageIdConfigurationKey);

    if (!pageId) {
      reportInspirationCmsIssue(pageIdConfigurationKey + " is missing.");
      return null;
    }

    if (!shopwareIdPattern.test(pageId)) {
      reportInspirationCmsIssue(
        pageIdConfigurationKey + " must be a 32-character Shopware ID.",
      );
      return null;
    }

    return await getShopwareCmsPage({ client, id: pageId });
  } catch (error) {
    reportInspirationCmsIssue(
      "Failed to load the inspiration CMS page.",
      error,
    );
    return null;
  }
}
