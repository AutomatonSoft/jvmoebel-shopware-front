import Link from "next/link";

import { Container } from "@/components/ui/container";
import type { CmsLandingPage } from "@/features/cms/model/landing-page";

import { CmsPageRenderer } from "./cms-page-renderer";

type CmsLandingPageViewProps = Readonly<{
  page: CmsLandingPage;
}>;

export function CmsLandingPageView({ page }: CmsLandingPageViewProps) {
  return (
    <main className="flex-1">
      <Container
        aria-label="Breadcrumb"
        as="nav"
        className="flex items-center gap-2 py-4 text-sm text-muted-foreground"
      >
        <Link className="transition hover:text-foreground" href="/">
          Startseite
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-foreground">
          {page.name}
        </span>
      </Container>

      <CmsPageRenderer page={page.cmsPage} />
    </main>
  );
}
