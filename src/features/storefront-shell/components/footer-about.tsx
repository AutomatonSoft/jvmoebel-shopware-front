import { ContractRevocationDialog } from "@/features/storefront-shell/components/contract-revocation-dialog";
import { StoreLogo } from "@/features/storefront-shell/components/store-logo";
import type { StorefrontBranding } from "@/features/storefront-shell/model/branding";

export type FooterAboutProps = {
  branding: StorefrontBranding;
};

export function FooterAbout({ branding }: FooterAboutProps) {
  return (
    <section className="border-footer-border bg-footer-panel text-footer-foreground col-span-2 rounded-3xl border p-7 sm:p-10">
      <StoreLogo branding={branding} variant="footer" />
      <p className="text-footer-muted mt-9 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] uppercase before:block before:size-2 before:bg-primary">
        Über uns
      </p>
      <h2 className="mt-4 max-w-lg text-3xl leading-tight font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
        Möbel mit Charakter, gemacht für das echte Leben.
      </h2>
      <p className="text-footer-body mt-6 max-w-2xl text-sm leading-7">
        Wir bieten unseren Kunden schönes und praktisches für Haus und Garten.
        Die Produktpalette ist breit gefächert. Von handgefertigten Ledersofas
        über klassische Chesterfield wie stylische Wohnmöbel bis zu den eigen
        gefertigten Designer Garnituren ist alles dabei, was das Einrichterherz
        begehrt. Das stetig wachsende Auftragsvolumen schultert das Team von
        jvmoebel.de mittels modernster Technologien und durchdachten Strukturen
        mit Spaß und Motivation. Masse – aber bitte mit Klasse ist das Motto,
        das von unseren Mitarbeitern Tag für Tag gelebt wird. Schließen Sie sich
        der Gemeinschaft unserer zufriedenen Kunden an. Ihr gemütliches Heim ist
        unser Ziel!
      </p>
      <ContractRevocationDialog />
    </section>
  );
}
