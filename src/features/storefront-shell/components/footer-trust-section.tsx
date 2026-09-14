import type { StorefrontFooterContent } from "@/features/storefront-shell/model/footer";

type FooterTrustSectionProps = Pick<
  StorefrontFooterContent,
  | "headings"
  | "internationalLinks"
  | "paymentMethods"
  | "shippingBadges"
  | "socialLinks"
>;

export function FooterTrustSection({
  headings,
  internationalLinks,
  paymentMethods,
  shippingBadges,
  socialLinks,
}: FooterTrustSectionProps) {
  if (
    internationalLinks.length === 0 &&
    paymentMethods.length === 0 &&
    shippingBadges.length === 0 &&
    socialLinks.length === 0
  ) {
    return null;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
      {paymentMethods.length > 0 && (
        <section aria-labelledby="payment-methods-heading">
          <h2
            className="text-xs font-semibold tracking-[0.16em] uppercase"
            id="payment-methods-heading"
          >
            {headings.paymentMethods}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {paymentMethods.map(({ id, label, media }) => (
              <li
                className="flex h-10 w-18 items-center justify-center rounded-lg border bg-background p-1.5"
                key={id}
              >
                {/* CMS media hosts are resolved by Shopware at runtime. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={media.alt}
                  className="h-full w-full object-contain"
                  title={label}
                  height={32}
                  src={media.url}
                  width={72}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {shippingBadges.length > 0 && (
        <section aria-labelledby="shipping-badges-heading">
          <h2
            className="text-xs font-semibold tracking-[0.16em] uppercase"
            id="shipping-badges-heading"
          >
            {headings.shippingBadges}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {shippingBadges.map(({ id, label, media }) => (
              <li
                className="flex h-10 min-w-18 items-center justify-center rounded-lg border bg-background px-2 py-1.5"
                key={id}
              >
                {/* CMS media hosts are resolved by Shopware at runtime. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={media.alt}
                  className="h-full max-w-24 object-contain"
                  height={32}
                  src={media.url}
                  title={label}
                  width={96}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {internationalLinks.length > 0 && (
        <nav aria-labelledby="international-links-heading">
          <h2
            className="text-xs font-semibold tracking-[0.16em] uppercase"
            id="international-links-heading"
          >
            {headings.internationalLinks}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {internationalLinks.map(
              ({
                id,
                label,
                media,
                openInNewTab,
                targetSalesChannelId,
                url,
              }) => (
                <li key={id}>
                  <a
                    aria-label={
                      openInNewTab
                        ? `${label} (öffnet in einem neuen Tab)`
                        : label
                    }
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border bg-background px-3 text-sm font-semibold transition-[background,border-color,transform] hover:border-primary hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none motion-safe:active:translate-y-px"
                    data-target-sales-channel-id={targetSalesChannelId}
                    href={url}
                    rel={openInNewTab ? "noreferrer" : undefined}
                    target={openInNewTab ? "_blank" : undefined}
                  >
                    {/* CMS media hosts are resolved by Shopware at runtime. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-cover"
                      height={20}
                      src={media.url}
                      width={20}
                    />
                    {label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>
      )}

      {socialLinks.length > 0 && (
        <section aria-labelledby="social-networks-heading">
          <h2
            className="text-xs font-semibold tracking-[0.16em] uppercase"
            id="social-networks-heading"
          >
            {headings.socialLinks}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {socialLinks.map(({ id, label, media, openInNewTab, url }) => (
              <a
                aria-label={
                  openInNewTab ? `${label} (öffnet in einem neuen Tab)` : label
                }
                className="flex size-10 items-center justify-center rounded-full border bg-background transition-[background,border-color,transform] hover:border-primary hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none motion-safe:active:translate-y-px"
                href={url}
                key={id}
                rel={openInNewTab ? "noreferrer" : undefined}
                title={label}
                target={openInNewTab ? "_blank" : undefined}
              >
                {/* CMS media hosts are resolved by Shopware at runtime. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={media.alt}
                  aria-hidden="true"
                  className="size-5 object-contain"
                  height={20}
                  src={media.url}
                  width={20}
                />
                <span className="sr-only">{label}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
