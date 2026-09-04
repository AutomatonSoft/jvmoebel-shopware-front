import type { StoreNavigationItem } from "@/features/storefront-shell/model/navigation";

export type FooterNavigationProps = {
  footerNavigation: StoreNavigationItem[];
  serviceNavigation: StoreNavigationItem[];
};

function getNavigationLinks(item: StoreNavigationItem) {
  return item.children.length > 0 ? item.children : [item];
}

export function FooterNavigation({
  footerNavigation,
  serviceNavigation,
}: FooterNavigationProps) {
  const categoryLinks = footerNavigation.flatMap(getNavigationLinks);
  const serviceLinks = serviceNavigation.flatMap(getNavigationLinks);

  return (
    <>
      <nav
        aria-label="Kategorien"
        className="border-footer-border border-t pt-7 sm:col-span-2"
      >
        <h2 className="text-footer-muted text-xs font-semibold tracking-[0.16em] uppercase">
          Kategorien
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
          {categoryLinks.map((item) => (
            <a
              className="text-footer-link hover:text-footer-accent-hover w-fit text-sm leading-5 underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] hover:decoration-current"
              href={item.href}
              key={item.id}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <nav aria-label="Service" className="border-footer-border border-t pt-7">
        <h2 className="text-footer-muted text-xs font-semibold tracking-[0.16em] uppercase">
          Service
        </h2>
        <div className="mt-6 flex flex-col gap-3">
          {serviceLinks.map((item) => (
            <a
              className="text-footer-link hover:text-footer-accent-hover w-fit text-sm leading-5 underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] hover:decoration-current"
              href={item.href}
              key={item.id}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
