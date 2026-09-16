import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { CmsPageRenderer } from "@/features/cms/components/cms-page-renderer";
import { getInspirationCmsPage } from "@/features/inspiration/server/inspiration-page";
import { ErrorExperience } from "@/features/storefront-shell/components/error-experience";

export const metadata: Metadata = {
  alternates: { canonical: "/inspiration" },
  description:
    "Entdecken Sie Wohnideen, Einrichtungstrends und abgestimmte Möbel für jeden Raum bei JVMöbel.",
  title: "Wohnideen & Inspiration | JVMöbel",
};

export default async function InspirationPage() {
  const page = await getInspirationCmsPage();

  if (!page) {
    return (
      <ErrorExperience
        code="IDEEN"
        description="Unsere Wohnideen werden momentan für den neuen Shop vorbereitet."
        eyebrow="Seite wird vorbereitet"
        showShopLink
        title="Neue Inspiration ist bald verfügbar."
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
        <strong className="font-medium text-foreground">Inspiration</strong>
      </Container>
      <CmsPageRenderer page={page} />
    </main>
  );
}
