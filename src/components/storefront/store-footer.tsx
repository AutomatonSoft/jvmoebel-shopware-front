import { StoreLogo } from "@/components/storefront/store-logo";
import type { StorefrontBranding } from "@/features/storefront-shell/model/branding";
import type { StoreNavigationItem } from "@/features/storefront-shell/model/navigation";

export type StoreFooterProps = {
  branding: StorefrontBranding;
  footerNavigation: StoreNavigationItem[];
  serviceNavigation: StoreNavigationItem[];
};

function getNavigationLinks(item: StoreNavigationItem) {
  return item.children.length > 0 ? item.children : [item];
}

export function StoreFooter({
  branding,
  footerNavigation,
  serviceNavigation,
}: StoreFooterProps) {
  const legalLinks = serviceNavigation.flatMap(getNavigationLinks);

  return (
    <footer className="mt-auto bg-background">
      <div className="mx-auto grid w-full max-w-360 grid-cols-2 gap-x-5 gap-y-10 px-6 py-16 sm:px-8 lg:grid-cols-4 lg:gap-14 lg:py-20">
        <div className="col-span-2 lg:col-span-1">
          <StoreLogo branding={branding} variant="footer" />
          <p className="mt-6 max-w-xs text-sm leading-7 text-muted-foreground">
            Furniture with character, crafted for real homes and everyday life.
          </p>
        </div>

        {footerNavigation.map((column) => (
          <nav className="flex flex-col gap-3" key={column.id}>
            <h2 className="mb-2 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              {column.label}
            </h2>
            {getNavigationLinks(column).map((item) => (
              <a
                className="w-fit text-sm text-foreground/75 transition-colors hover:text-primary"
                href={item.href}
                key={item.id}
              >
                {item.label}
              </a>
            ))}
          </nav>
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-360 flex-col gap-4 border-t px-6 py-6 text-xs text-muted-foreground sm:px-8 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} JVMöbel. All rights reserved.</span>
        {legalLinks.length > 0 && (
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((item) => (
              <a
                className="transition-colors hover:text-primary"
                href={item.href}
                key={item.id}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}
