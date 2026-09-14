import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { getAboutCmsPage } from "@/features/about/server/about-page";
import { CmsPageRenderer } from "@/features/cms/components/cms-page-renderer";
import { ErrorExperience } from "@/features/storefront-shell/components/error-experience";

export const metadata: Metadata = {
  description:
    "Erfahren Sie mehr über JVMöbel, unsere Auswahl, unseren Service und unsere Philosophie.",
  title: "Über uns | JVMöbel",
};

export default async function AboutPage() {
  const page = await getAboutCmsPage();

  if (!page) {
    return (
      <ErrorExperience
        code="ABOUT"
        description="Unsere Unternehmensseite wird momentan für den neuen Shop vorbereitet."
        eyebrow="Seite wird vorbereitet"
        showShopLink
        title="Mehr über JVMöbel ist bald verfügbar."
      />
    );
  }

  return (
    <main className="flex-1 pb-16 sm:pb-24">
      <Container
        as="nav"
        aria-label="Breadcrumb"
        className="flex items-center gap-2.5 pt-6 text-xs text-muted-foreground"
      >
        <Link className="transition-colors hover:text-primary" href="/">
          Startseite
        </Link>
        <span aria-hidden="true">/</span>
        <strong className="font-medium text-foreground">Über uns</strong>
      </Container>
      <CmsPageRenderer page={page} />
    </main>
  );
}
