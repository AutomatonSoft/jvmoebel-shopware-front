import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { CmsPageRenderer } from "@/features/cms/components/cms-page-renderer";
import { getDiscountOffersCmsPage } from "@/features/offers/server/discount-offers-page";
import { ErrorExperience } from "@/features/storefront-shell/components/error-experience";

export const metadata: Metadata = {
  description: "Entdecke reduzierte Möbel und Wohnaccessoires im JVMöbel Sale.",
  title: "Möbel Sale & Rabattangebote | JVMöbel",
};

export default async function OffersPage() {
  const page = await getDiscountOffersCmsPage();

  if (!page) {
    return (
      <ErrorExperience
        code="SALE"
        description="Die Angebotsdaten werden momentan für den neuen Shop vorbereitet. Sobald die reduzierten Produkte freigegeben sind, erscheinen sie automatisch auf dieser Seite."
        eyebrow="Angebote werden vorbereitet"
        showShopLink={false}
        title="Unser Sale ist bald für Sie verfügbar."
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
        <strong className="font-medium text-foreground">Angebote</strong>
      </Container>
      <CmsPageRenderer page={page} />
    </main>
  );
}
