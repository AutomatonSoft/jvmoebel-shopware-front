import { ArrowUpRight } from "lucide-react";

import { StoreLogo } from "@/features/storefront-shell/components/store-logo";
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
      <div className="mx-auto grid w-full max-w-360 grid-cols-2 gap-x-5 gap-y-10 px-6 py-16 sm:px-8 xl:grid-cols-5 xl:gap-10 xl:py-20">
        <section className="col-span-2 rounded-3xl border border-[#d7d9ce] bg-[#eef0e8] p-7 text-[#465047] sm:p-10">
          <StoreLogo branding={branding} variant="footer" />
          <p className="mt-9 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-[#737b70] uppercase before:block before:size-2 before:bg-primary">
            Über uns
          </p>
          <h2 className="mt-4 max-w-lg text-3xl leading-tight font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
            Möbel mit Charakter, gemacht für das echte Leben.
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[#626b61]">
            Wir bieten unseren Kunden schönes und praktisches für Haus und
            Garten. Die Produktpalette ist breit gefächert. Von handgefertigten
            Ledersofas über klassische Chesterfield wie stylische Wohnmöbel bis
            zu den eigen gefertigten Designer Garnituren ist alles dabei, was
            das Einrichterherz begehrt. Das stetig wachsende Auftragsvolumen
            schultert das Team von jvmoebel.de mittels modernster Technologien
            und durchdachten Strukturen mit Spaß und Motivation. Masse – aber
            bitte mit Klasse ist das Motto, das von unseren Mitarbeitern Tag für
            Tag gelebt wird. Schließen Sie sich der Gemeinschaft unserer
            zufriedenen Kunden an. Ihr gemütliches Heim ist unser Ziel!
          </p>
          <a
            aria-label="Vertrag kündigen (öffnet in einem neuen Tab)"
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#cf7859] px-5 text-sm font-semibold text-[#fffaf5] transition-[background,transform] hover:bg-[#b96548] focus-visible:ring-3 focus-visible:ring-[#cf7859]/30 motion-safe:active:translate-y-px"
            href="https://www.jvmoebel.de/Infos/Widerruf.htm"
            rel="noreferrer"
            target="_blank"
          >
            Vertrag kündigen
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </section>

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
        <span>
          © {new Date().getFullYear()} JVMöbel. Alle Rechte vorbehalten.
        </span>
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
