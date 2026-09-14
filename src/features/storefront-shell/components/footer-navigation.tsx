import type { Route } from "next";
import Link from "next/link";

import type { StoreNavigationItem } from "@/features/storefront-shell/model/navigation";
import type { StorefrontFooterContent } from "@/features/storefront-shell/model/footer";

export type FooterNavigationProps = {
  footerNavigation: StoreNavigationItem[];
  headings: StorefrontFooterContent["headings"];
  serviceNavigation: StoreNavigationItem[];
};

function getNavigationLinks(item: StoreNavigationItem) {
  return item.children.length > 0 ? item.children : [item];
}

export function FooterNavigation({
  footerNavigation,
  headings,
  serviceNavigation,
}: FooterNavigationProps) {
  const serviceLinks = serviceNavigation.flatMap(getNavigationLinks);

  return (
    <>
      <nav aria-label="Kategorien" className="sm:col-span-2">
        <h2 className="text-xs font-semibold tracking-[0.16em] uppercase">
          {headings.categories}
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
          {footerNavigation.map((item) => (
            <Link
              className="w-fit text-sm leading-5 text-muted-foreground underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] hover:text-foreground hover:decoration-primary focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              href={item.href as Route}
              key={item.id}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <nav aria-label="Service">
        <h2 className="text-xs font-semibold tracking-[0.16em] uppercase">
          {headings.service}
        </h2>
        <div className="mt-6 flex flex-col gap-3">
          {serviceLinks.map((item) => (
            <Link
              className="w-fit text-sm leading-5 text-muted-foreground underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] hover:text-foreground hover:decoration-primary focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              href={item.href as Route}
              key={item.id}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
