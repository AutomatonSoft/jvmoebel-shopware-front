import { CmsPageRenderer } from "@/features/cms/components/cms-page-renderer";
import { getHomeCmsPage } from "@/features/cms/server/home-page";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

export default async function Home() {
  const session = getShopwareRequestSession();
  const page = await getHomeCmsPage({ client: session.client });

  return (
    <main className="flex-1">
      <CmsPageRenderer page={page} />
    </main>
  );
}
