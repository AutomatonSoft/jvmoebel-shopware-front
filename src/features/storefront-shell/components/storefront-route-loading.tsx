import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryPageLoading } from "@/features/catalog/components/category-page-loading";
import { ProductDetailLoading } from "@/features/catalog/components/product-detail-loading";
import { CmsLandingPageLoading } from "@/features/cms/components/cms-landing-page-loading";

type StorefrontPageKind = "category" | "landing-page" | "product";

export function StorefrontRouteLoading() {
  return (
    <main aria-busy="true" aria-label="Seite wird geladen" className="flex-1">
      <Container className="py-6 sm:py-8">
        <div aria-hidden="true" className="flex items-center gap-2.5">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="size-1 rounded-full" />
          <Skeleton className="h-3 w-28" />
        </div>
        <section aria-hidden="true" className="max-w-3xl py-12 sm:py-16">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-5 h-10 w-full sm:h-12" />
          <Skeleton className="mt-3 h-10 w-4/5 sm:h-12" />
          <Skeleton className="mt-7 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
        </section>
        <section aria-hidden="true" className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton className="aspect-[4/3] rounded-2xl" key={index} />
          ))}
        </section>
      </Container>
      <span className="sr-only" role="status">
        Seite wird geladen...
      </span>
    </main>
  );
}

export function StorefrontPageLoading({ kind }: { kind: StorefrontPageKind }) {
  if (kind === "category") {
    return <CategoryPageLoading />;
  }

  if (kind === "product") {
    return <ProductDetailLoading />;
  }

  return <CmsLandingPageLoading />;
}
