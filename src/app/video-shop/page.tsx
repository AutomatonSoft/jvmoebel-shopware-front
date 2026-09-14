import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { CmsPageRenderer } from "@/features/cms/components/cms-page-renderer";
import { ErrorExperience } from "@/features/storefront-shell/components/error-experience";
import { getVideoShopCmsPage } from "@/features/video-shop/server/video-shop-page";

export const metadata: Metadata = {
  description:
    "Entdecken Sie Möbel, Wohnwelten und Einrichtungsideen von JVMöbel im Video.",
  title: "Video Shop | JVMöbel",
};

export default async function VideoShopPage() {
  const page = await getVideoShopCmsPage();

  if (!page) {
    return (
      <ErrorExperience
        code="VIDEO-SHOP"
        description="Unsere Videoseite wird momentan für den neuen Shop vorbereitet."
        eyebrow="Seite wird vorbereitet"
        showShopLink
        title="Der Video Shop ist bald verfügbar."
      />
    );
  }

  return (
    <main className="flex-1">
      <Container
        as="nav"
        aria-label="Breadcrumb"
        className="flex items-center gap-2.5 pt-6 text-xs text-muted-foreground"
      >
        <Link className="transition-colors hover:text-primary" href="/">
          Startseite
        </Link>
        <span aria-hidden="true">/</span>
        <strong className="font-medium text-foreground">Video Shop</strong>
      </Container>
      <CmsPageRenderer page={page} />
    </main>
  );
}
