import { Container } from "@/components/ui/container";
import { FooterAbout } from "@/features/storefront-shell/components/footer-about";
import { FooterNavigation } from "@/features/storefront-shell/components/footer-navigation";
import { FooterTrustSection } from "@/features/storefront-shell/components/footer-trust-section";
import type { StorefrontBranding } from "@/features/storefront-shell/model/branding";
import type { StorefrontFooterContent } from "@/features/storefront-shell/model/footer";
import type { StoreNavigationItem } from "@/features/storefront-shell/model/navigation";

export type StoreFooterProps = {
  branding: StorefrontBranding;
  content: StorefrontFooterContent;
  footerNavigation: StoreNavigationItem[];
  serviceNavigation: StoreNavigationItem[];
};

export function StoreFooter({
  branding,
  content,
  footerNavigation,
  serviceNavigation,
}: StoreFooterProps) {
  return (
    <footer className="mt-auto bg-background">
      <Container className="grid grid-cols-2 gap-x-5 gap-y-10 py-16 xl:grid-cols-5 xl:gap-10 xl:py-20">
        <FooterAbout
          branding={branding}
          content={content.about}
          revocation={content.revocation}
        />

        <div className="col-span-2 grid gap-x-10 gap-y-10 sm:grid-cols-3 xl:col-span-3">
          <FooterNavigation
            headings={content.headings}
            footerNavigation={footerNavigation}
            serviceNavigation={serviceNavigation}
          />
          <FooterTrustSection
            headings={content.headings}
            paymentMethods={content.paymentMethods}
            socialLinks={content.socialLinks}
          />
        </div>
      </Container>

      <Container className="border-t py-6 text-xs text-muted-foreground">
        <span>
          {content.copyright
            .replaceAll("{year}", String(new Date().getFullYear()))
            .replaceAll("{storeName}", branding.name)}
        </span>
      </Container>
    </footer>
  );
}
