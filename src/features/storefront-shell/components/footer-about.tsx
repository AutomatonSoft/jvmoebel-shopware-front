import { ContractRevocationDialog } from "@/features/storefront-shell/components/contract-revocation-dialog";
import { StoreLogo } from "@/features/storefront-shell/components/store-logo";
import type { StorefrontBranding } from "@/features/storefront-shell/model/branding";
import type { StorefrontFooterContent } from "@/features/storefront-shell/model/footer";

export type FooterAboutProps = {
  branding: StorefrontBranding;
  content: StorefrontFooterContent["about"];
  revocation: StorefrontFooterContent["revocation"];
};

export function FooterAbout({
  branding,
  content,
  revocation,
}: FooterAboutProps) {
  return (
    <section className="border-footer-border bg-footer-panel text-footer-foreground col-span-2 rounded-3xl border p-7 sm:p-10">
      <StoreLogo branding={branding} variant="footer" />
      <p className="text-footer-muted mt-9 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] uppercase before:block before:size-2 before:bg-primary">
        {content.eyebrow}
      </p>
      <h2 className="mt-4 max-w-lg text-3xl leading-tight font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
        {content.title}
      </h2>
      <p className="text-footer-body mt-6 max-w-2xl text-sm leading-7">
        {content.description}
      </p>
      <ContractRevocationDialog content={revocation} />
    </section>
  );
}
