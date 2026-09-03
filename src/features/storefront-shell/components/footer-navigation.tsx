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
        className="border-t border-[#d9d7ce] pt-7 sm:col-span-2"
      >
        <h2 className="text-xs font-semibold tracking-[0.16em] text-[#72786f] uppercase">
          Kategorien
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
          {categoryLinks.map((item) => (
            <a
              className="w-fit text-sm leading-5 text-[#596158] underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] hover:text-[#b96548] hover:decoration-current"
              href={item.href}
              key={item.id}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <nav aria-label="Service" className="border-t border-[#d9d7ce] pt-7">
        <h2 className="text-xs font-semibold tracking-[0.16em] text-[#72786f] uppercase">
          Service
        </h2>
        <div className="mt-6 flex flex-col gap-3">
          {serviceLinks.map((item) => (
            <a
              className="w-fit text-sm leading-5 text-[#596158] underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] hover:text-[#b96548] hover:decoration-current"
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
