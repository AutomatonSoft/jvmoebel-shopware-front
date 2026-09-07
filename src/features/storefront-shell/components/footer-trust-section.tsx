import Image from "next/image";

const paymentMethods = [
  { label: "Mastercard", src: "/images/icons/mastercard.webp" },
  { label: "Visa", src: "/images/icons/visa.webp" },
  { label: "Vorkasse", src: "/images/icons/vorkasse.webp" },
  { label: "Amazon Pay", src: "/images/icons/amazon.webp" },
  { label: "PayPal", src: "/images/icons/paypal.webp" },
  { label: "Klarna", src: "/images/icons/klarna.webp" },
] as const;

const socialLinks = [
  {
    href: "https://www.facebook.com/jvmoebel.de",
    label: "Facebook",
    src: "/images/icons/facebook.png",
  },
  {
    href: "https://www.instagram.com/home_luxus_style_design/",
    label: "Instagram",
    src: "/images/icons/instagram.png",
  },
  {
    href: "https://api.whatsapp.com/message/I5VAPEHCQNQTM1?autoload=1&app_absent=0",
    label: "WhatsApp",
    src: "/images/icons/whatsapp.png",
  },
  {
    href: "https://www.youtube.com/channel/UClp5F2jZKfTJG1o902C1-eQ",
    label: "YouTube",
    src: "/images/icons/youtube.png",
  },
  {
    href: "https://www.pinterest.de/jvmoebel_de",
    label: "Pinterest",
    src: "/images/icons/pinterest.png",
  },
  {
    href: "https://t.me/XLANDJV",
    label: "Telegram",
    src: "/images/icons/telegram.png",
  },
] as const;

export function FooterTrustSection() {
  return (
    <div className="border-footer-border grid gap-8 border-t pt-7 sm:col-span-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      <section aria-labelledby="payment-methods-heading">
        <h2
          className="text-footer-muted text-xs font-semibold tracking-[0.16em] uppercase"
          id="payment-methods-heading"
        >
          Zahlungsarten
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {paymentMethods.map(({ label, src }) => (
            <li
              className="border-footer-border bg-footer-tile flex h-10 w-18 items-center justify-center rounded-xl border p-1.5"
              key={label}
            >
              <Image
                alt={label}
                className="h-full w-full object-contain"
                title={label}
                height={32}
                src={src}
                width={72}
              />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="social-networks-heading">
        <h2
          className="text-footer-muted text-xs font-semibold tracking-[0.16em] uppercase"
          id="social-networks-heading"
        >
          Soziale Netzwerke
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {socialLinks.map(({ href, label, src }) => (
            <a
              aria-label={`${label} (öffnet in einem neuen Tab)`}
              className="border-footer-border bg-footer-control text-footer-foreground hover:border-footer-accent hover:bg-footer-control-hover hover:text-footer-accent-hover focus-visible:ring-footer-accent/30 flex size-10 items-center justify-center rounded-full border transition-[background,border-color,color,transform] focus-visible:ring-3 motion-safe:active:translate-y-px"
              href={href}
              key={label}
              title={label}
              target="_blank"
            >
              <Image
                alt={label}
                aria-hidden="true"
                className="size-5 object-contain"
                height={20}
                src={src}
                width={20}
              />
              <span className="sr-only">{label}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
