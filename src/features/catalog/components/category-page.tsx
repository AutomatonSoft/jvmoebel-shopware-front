import { ArrowRight, PackageOpen } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { ShopCatalog } from "@/features/catalog/components/shop-catalog";
import type { ShopCategoryPage } from "@/features/catalog/model/category-page";

export function CategoryPage({ page }: { page: ShopCategoryPage }) {
  const { breadcrumbs, category, children, listing } = page;

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-360 px-4 pt-6 sm:px-8">
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

        <header className="border-b pt-9 pb-7 sm:flex sm:items-end sm:justify-between sm:gap-8">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[0.625rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase before:block before:size-1.5 before:rounded-full before:bg-primary">
              Kategorie
            </p>
            <h1 className="text-3xl leading-none font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
              {category.name}
            </h1>
          </div>
          {category.description && (
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:mt-0 sm:text-right">
              {category.description}
            </p>
          )}
        </header>

        {children.length > 0 && (
          <section className="border-b py-8" aria-labelledby="subcategories">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[0.625rem] font-semibold tracking-[0.14em] text-primary uppercase">
                  Weiter entdecken
                </p>
                <h2
                  className="text-xl font-semibold tracking-[-0.03em]"
                  id="subcategories"
                >
                  Unterkategorien
                </h2>
              </div>
              <span className="text-xs text-muted-foreground">
                {children.length} Kategorien
              </span>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {children.map((child) => (
                <li key={child.id}>
                  <Link
                    className="group flex min-h-16 items-center justify-between gap-4 rounded-xl border bg-card px-4 py-3 text-sm font-semibold transition-[border-color,box-shadow,transform] hover:border-primary/40 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:active:scale-[.99]"
                    href={child.href as Route}
                  >
                    <span>{child.label}</span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {listing ? (
        <ShopCatalog hideHeader listing={listing} />
      ) : (
        <section className="mx-auto w-full max-w-360 px-4 py-12 sm:px-8 sm:py-16">
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
        </section>
      )}
    </main>
  );
}
