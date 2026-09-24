import { cacheLife } from "next/cache";

import { Container } from "@/components/ui/container";
import { FooterAbout } from "@/features/storefront-shell/components/footer-about";
import { FooterNavigation } from "@/features/storefront-shell/components/footer-navigation";
import { FooterTrustSection } from "@/features/storefront-shell/components/footer-trust-section";
import { ContactWidget } from "@/features/storefront-shell/components/contact-widget";
import type { StorefrontBranding } from "@/features/storefront-shell/model/branding";
import type { StorefrontFooterContent } from "@/features/storefront-shell/model/footer";
import type { StoreNavigationItem } from "@/features/storefront-shell/model/navigation";

export type StoreFooterProps = {
  branding: StorefrontBranding;
  content: StorefrontFooterContent;
  footerNavigation: StoreNavigationItem[];
  serviceNavigation: StoreNavigationItem[];
};

async function getCopyrightYear() {
  "use cache";
  cacheLife({ revalidate: 3600, expire: 86400 });

  return new Date().getFullYear();
}

export async function StoreFooter({
  branding,
  content,
  footerNavigation,
  serviceNavigation,
}: StoreFooterProps) {
  const copyrightYear = await getCopyrightYear();

  return (
    <footer className="mt-auto bg-background pt-4 sm:pt-8">
      <Container>
        <div className="overflow-hidden rounded-t-3xl border-x border-t bg-secondary">
          <div className="px-6 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
            <div className="grid gap-12 lg:grid-cols-[minmax(16rem,0.85fr)_minmax(0,1.65fr)] lg:gap-16 xl:gap-24">
              <FooterAbout
                branding={branding}
                content={content.about}
                revocation={content.revocation}
              />

              <div className="grid gap-x-10 gap-y-10 sm:grid-cols-3">
                <FooterNavigation
                  headings={content.headings}
                  footerNavigation={footerNavigation}
                  serviceNavigation={serviceNavigation}
                />
              </div>
            </div>

            <div className="mt-12 border-t pt-8 sm:mt-14">
              <FooterTrustSection
                headings={content.headings}
                internationalLinks={content.internationalLinks}
                paymentMethods={content.paymentMethods}
                shippingBadges={content.shippingBadges}
                socialLinks={content.socialLinks}
              />
            </div>
          </div>

          <div className="border-t bg-background/45 px-6 py-5 text-xs text-muted-foreground sm:px-10 lg:px-12">
            <span>
              {content.copyright
                .replaceAll("{year}", String(copyrightYear))
                .replaceAll("{storeName}", branding.name)}
            </span>
          </div>
        </div>
      </Container>
      <ContactWidget channels={content.contactWidget?.channels} />
    </footer>
  );
}
