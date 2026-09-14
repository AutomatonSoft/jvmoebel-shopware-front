import { ChevronDown } from "lucide-react";

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
    <section className="text-foreground">
      <StoreLogo branding={branding} variant="footer" />
      <p className="mt-8 flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase before:block before:size-1.5 before:rounded-full before:bg-primary">
        {content.eyebrow}
      </p>
      <h2 className="mt-3 max-w-md text-xl leading-tight font-semibold tracking-[-0.035em] text-balance sm:text-2xl">
        {content.title}
      </h2>
      <details className="group mt-5 max-w-lg">
        <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-sm font-semibold underline decoration-transparent underline-offset-4 transition-colors hover:text-primary hover:decoration-current focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
          Mehr über {branding.name}
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition-transform group-open:rotate-180"
          />
        </summary>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {content.description}
        </p>
      </details>
      {revocation.enabled && <ContractRevocationDialog content={revocation} />}
    </section>
  );
}
