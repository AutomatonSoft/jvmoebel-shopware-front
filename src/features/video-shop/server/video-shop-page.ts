import "server-only";

import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type { CmsPage } from "@/features/cms/model/page";
import { videoShopCmsPageMock } from "@/features/video-shop/fixtures/video-shop-page";
import { getShopwareCmsPage } from "@/integrations/shopware/cms";
import { getShopwareContext } from "@/integrations/shopware/context";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

const shopwareIdPattern = /^[0-9a-f]{32}$/i;
const pageIdConfigurationKey = "jvStorefrontVideoShopCmsPageId";
const videoGridClasses =
  "grid grid-cols-1 gap-5 pb-16 sm:gap-7 lg:grid-cols-2 sm:pb-24";

function reportVideoShopCmsIssue(message: string, cause?: unknown) {
  console.error("Video Shop CMS issue.", {
    ...(cause instanceof Error ? { cause: cause.message } : {}),
    message,
  });
}

function applyVideoShopLayout(page: CmsPage): CmsPage {
  return {
    ...page,
    sections: page.sections.map((section) => {
      const containsOnlyVideoBlocks =
        section.blocks.length > 0 &&
        section.blocks.every(
          (block) =>
            block.slots.length === 1 &&
            block.slots[0]?.type === "youtube-video",
        );

      if (!containsOnlyVideoBlocks) {
        return section;
      }

      return {
        ...section,
        cssClass: [section.cssClass, videoGridClasses]
          .filter(Boolean)
          .join(" "),
        sizingMode: "boxed",
      };
    }),
  };
}

export async function getVideoShopCmsPage(): Promise<CmsPage | null> {
  if (shouldUseShopwareMocks()) {
    return videoShopCmsPageMock;
  }

  try {
    const client = getShopwareRequestSession().client;
    const context = await getShopwareContext(client);
    const configuration = getCmsRecord(context.salesChannel.configuration);
    const pageId = getCmsString(configuration, pageIdConfigurationKey);

    if (!pageId) {
      reportVideoShopCmsIssue(`${pageIdConfigurationKey} is missing.`);
      return null;
    }

    if (!shopwareIdPattern.test(pageId)) {
      reportVideoShopCmsIssue(
        `${pageIdConfigurationKey} must be a 32-character Shopware ID.`,
      );
      return null;
    }

    const page = await getShopwareCmsPage({ client, id: pageId });

    return applyVideoShopLayout(page);
  } catch (error) {
    reportVideoShopCmsIssue("Failed to load the Video Shop CMS page.", error);
    return null;
  }
}
