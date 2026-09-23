import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { Suspense } from "react";

import { CmsPageRenderer } from "@/features/cms/components/cms-page-renderer";
import { CmsLandingPageLoading } from "@/features/cms/components/cms-landing-page-loading";
import { getHomeCmsPage } from "@/features/cms/server/home-page";
import { HomePreparationState } from "@/features/storefront-shell/components/home-preparation-state";
import { shopwareCacheTtlSeconds } from "@/integrations/shopware/cache-policy";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";

async function CachedHome() {
  "use cache";
  cacheLife({
    revalidate: shopwareCacheTtlSeconds.homeCmsPage,
    expire: 3600,
  });
  cacheTag("shopware:cms");

  const page = await getHomeCmsPage();

  if (!page) {
    return <HomePreparationState />;
  }

  return (
    <main className="flex-1">
      <CmsPageRenderer page={page} />
    </main>
  );
}

async function HomeContent() {
  if (
    !shouldUseShopwareMocks() &&
    (!process.env.SHOPWARE_ENDPOINT || !process.env.SHOPWARE_ACCESS_TOKEN)
  ) {
    await connection();
  }

  return <CachedHome />;
}

export default function Home() {
  return (
    <Suspense fallback={<CmsLandingPageLoading />}>
      <HomeContent />
    </Suspense>
  );
}
