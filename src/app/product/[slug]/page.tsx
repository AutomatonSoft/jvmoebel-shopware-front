import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getShopProductDetailMock } from "@/lib/shopware/mocks/product-detail";

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getShopProductDetailMock(slug);

  if (!page) {
    return {
      robots: { index: false },
      title: "Product not found | JVMÃ¶bel",
    };
  }

  return {
    description: page.product.description,
    title: `${page.product.name} | JVMÃ¶bel`,
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const page = getShopProductDetailMock(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-360 px-4 py-6 sm:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2.5 text-[0.625rem] text-muted-foreground"
        >
          <Link className="transition-colors hover:text-primary" href="/">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link className="transition-colors hover:text-primary" href="/shop">
            Shop
          </Link>
          <span aria-hidden="true">/</span>
          <strong className="font-medium text-foreground">
            {page.product.name}
          </strong>
        </nav>

        <section className="py-16 sm:py-24">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            {page.product.company}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            {page.product.name}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground">
            {page.product.longDescription}
          </p>
        </section>
      </div>
    </main>
  );
}
