import type { Metadata } from "next";
import Link from "next/link";

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
      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex w-full max-w-360 items-center gap-2.5 px-4 pt-6 text-xs text-muted-foreground sm:px-8"
      >
        <Link className="transition-colors hover:text-primary" href="/">
          Startseite
        </Link>
        <span aria-hidden="true">/</span>
        <strong className="font-medium text-foreground">Angebote</strong>
      </nav>
      <CmsPageRenderer page={page} />
    </main>
  );
}
