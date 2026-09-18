import type { CmsPage } from "@/features/cms/model/page";

export type CmsLandingPage = Readonly<{
  cmsPage: CmsPage;
  id: string;
  metaDescription?: string;
  metaTitle?: string;
  name: string;
}>;
