import { Suspense } from "react";

import { CmsPageRenderer } from "@/features/cms/components/cms-page-renderer";
import { CmsLandingPageLoading } from "@/features/cms/components/cms-landing-page-loading";
import { getHomeCmsPage } from "@/features/cms/server/home-page";
import { HomePreparationState } from "@/features/storefront-shell/components/home-preparation-state";
async function HomeContent() {
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

export default function Home() {
  return (
    <Suspense fallback={<CmsLandingPageLoading />}>
      <HomeContent />
    </Suspense>
  );
}
