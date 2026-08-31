import { CmsPageRenderer } from "@/components/cms/cms-page-renderer";
import { getShopwareRequestSession } from "@/integrations/shopware/session";
import { getHomeCmsPage } from "@/lib/shopware/home-cms";

export default async function Home() {
  const session = getShopwareRequestSession();
  const page = await getHomeCmsPage({ client: session.client });

  return (
    <main className="flex-1">
      <CmsPageRenderer page={page} />
    </main>
  );
}
