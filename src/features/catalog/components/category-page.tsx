import { ListFilter, PackageOpen } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { ShopProductListingCatalog } from "@/features/catalog/components/shop-catalog";
import type { ShopCategoryPage } from "@/features/catalog/model/category-page";
import { CmsPageRenderer } from "@/features/cms/components/cms-page-renderer";

export function CategoryPage({ page }: { page: ShopCategoryPage }) {
  const { breadcrumbs, category, children, cmsPage, listing } = page;

  return (
    <main className="flex-1">
      <Container className="pt-6">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2.5 text-[0.625rem] text-muted-foreground"
        >
          <Link className="transition-colors hover:text-primary" href="/">
            Home
          </Link>
          {breadcrumbs.map((breadcrumb) => (
            <span className="contents" key={breadcrumb.id}>
              <span aria-hidden="true">/</span>
              <Link
                className="transition-colors hover:text-primary"
                href={breadcrumb.href as Route}
              >
                {breadcrumb.label}
              </Link>
            </span>
          ))}
          <span aria-hidden="true">/</span>
          <strong className="font-medium text-foreground">
            {category.name}
          </strong>
        </nav>

        {!cmsPage && (
          <PageHeader
            aside={
              category.description ? (
                <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-right">
                  {category.description}
                </p>
              ) : undefined
            }
            className="pt-6"
            eyebrow="Kategorie"
            title={category.name}
          />
        )}

        {!cmsPage && children.length > 0 && (
          <section className="border-b py-4" aria-labelledby="subcategories">
            <h2 className="sr-only" id="subcategories">
              Unterkategorien
            </h2>
            <div className="-mx-4 overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max min-w-full gap-2">
                <span className="flex h-11 shrink-0 items-center gap-2 rounded-md border bg-background px-3.5 text-sm font-semibold">
                  <ListFilter className="size-4 text-muted-foreground" />
                  Kategorien
                </span>
                <ul className="flex gap-2">
                  {children.map((child) => (
                    <li key={child.id}>
                      <Link
                        className="flex h-11 items-center whitespace-nowrap rounded-md border bg-background px-4 text-sm font-medium transition-[border-color,background-color,color] hover:border-primary/40 hover:bg-muted/60 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        href={child.href as Route}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}
      </Container>

      {cmsPage ? (
        <CmsPageRenderer
          page={cmsPage}
          renderContext={{ category, categoryListing: listing }}
        />
      ) : listing ? (
        <ShopProductListingCatalog hideHeader listing={listing} />
      ) : (
        <Container as="section" className="py-12 sm:py-16">
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed bg-card/40 px-6 text-center">
            <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <PackageOpen className="size-5 text-primary" />
            </span>
            <h2 className="text-lg font-semibold">
              Keine Produkte in dieser Kategorie
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Wählen Sie eine Unterkategorie, um passende Produkte zu sehen.
            </p>
          </div>
        </Container>
      )}
    </main>
  );
}
