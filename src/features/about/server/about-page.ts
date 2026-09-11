import "server-only";

import { aboutCmsPageMock } from "@/features/about/fixtures/about-page";
import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type { CmsPage } from "@/features/cms/model/page";
import { getShopwareCmsPage } from "@/integrations/shopware/cms";
import { getShopwareContext } from "@/integrations/shopware/context";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

const shopwareIdPattern = /^[0-9a-f]{32}$/i;
const pageIdConfigurationKey = "jvStorefrontAboutCmsPageId";

function reportAboutCmsIssue(message: string, cause?: unknown) {
  console.error("About CMS issue.", {
    ...(cause instanceof Error ? { cause: cause.message } : {}),
    message,
  });
}

export async function getAboutCmsPage(): Promise<CmsPage | null> {
  if (shouldUseShopwareMocks()) {
    return aboutCmsPageMock;
  }

  try {
    const client = getShopwareRequestSession().client;
    const context = await getShopwareContext(client);
    const configuration = getCmsRecord(context.salesChannel.configuration);
    const pageId = getCmsString(configuration, pageIdConfigurationKey);

    if (!pageId) {
      reportAboutCmsIssue(`${pageIdConfigurationKey} is missing.`);
      return null;
    }

    if (!shopwareIdPattern.test(pageId)) {
      reportAboutCmsIssue(
        `${pageIdConfigurationKey} must be a 32-character Shopware ID.`,
      );
      return null;
    }

    return await getShopwareCmsPage({ client, id: pageId });
  } catch (error) {
    reportAboutCmsIssue("Failed to load the about CMS page.", error);
    return null;
  }
}
