import type { StorefrontFooterContent } from "@/features/storefront-shell/model/footer";

type FooterTrustSectionProps = Pick<
  StorefrontFooterContent,
  "headings" | "paymentMethods" | "socialLinks"
>;

export function FooterTrustSection({
  headings,
  paymentMethods,
  socialLinks,
}: FooterTrustSectionProps) {
  if (paymentMethods.length === 0 && socialLinks.length === 0) {
    return null;
  }

  return (
    <div className="border-footer-border grid gap-8 border-t pt-7 sm:col-span-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      {paymentMethods.length > 0 && (
        <section aria-labelledby="payment-methods-heading">
          <h2
            className="text-footer-muted text-xs font-semibold tracking-[0.16em] uppercase"
            id="payment-methods-heading"
          >
            {headings.paymentMethods}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {paymentMethods.map(({ id, label, media }) => (
              <li
                className="border-footer-border bg-footer-tile flex h-10 w-18 items-center justify-center rounded-xl border p-1.5"
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

      {socialLinks.length > 0 && (
        <section aria-labelledby="social-networks-heading">
          <h2
            className="text-footer-muted text-xs font-semibold tracking-[0.16em] uppercase"
            id="social-networks-heading"
          >
            {headings.socialLinks}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {socialLinks.map(({ id, label, media, url }) => (
              <a
                aria-label={`${label} (öffnet in einem neuen Tab)`}
                className="border-footer-border bg-footer-control text-footer-foreground hover:border-footer-accent hover:bg-footer-control-hover hover:text-footer-accent-hover focus-visible:ring-footer-accent/30 flex size-10 items-center justify-center rounded-full border transition-[background,border-color,color,transform] focus-visible:ring-3 motion-safe:active:translate-y-px"
                href={url}
                key={id}
                rel="noreferrer"
                title={label}
                target="_blank"
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
