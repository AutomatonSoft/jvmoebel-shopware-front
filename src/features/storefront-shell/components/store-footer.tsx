import { Camera, MessageCircle, Pin, Play, Send, ThumbsUp } from "lucide-react";

import { ContractRevocationDialog } from "@/features/storefront-shell/components/contract-revocation-dialog";
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

const paymentMethods = [
  "Mastercard",
  "Visa",
  "Vorkasse",
  "Amazon Pay",
  "PayPal",
  "Klarna",
] as const;

type PaymentMethod = (typeof paymentMethods)[number];

const socialLinks = [
  {
    href: "https://www.facebook.com/jvmoebel.de",
    icon: ThumbsUp,
    label: "Facebook",
  },
  {
    href: "https://www.instagram.com/home_luxus_style_design/",
    icon: Camera,
    label: "Instagram",
  },
  {
    href: "https://api.whatsapp.com/message/I5VAPEHCQNQTM1?autoload=1&app_absent=0",
    icon: MessageCircle,
    label: "WhatsApp",
  },
  {
    href: "https://www.youtube.com/channel/UClp5F2jZKfTJG1o902C1-eQ",
    icon: Play,
    label: "YouTube",
  },
  {
    href: "https://www.pinterest.de/jvmoebel_de",
    icon: Pin,
    label: "Pinterest",
  },
  {
    href: "https://t.me/XLANDJV",
    icon: Send,
    label: "Telegram",
  },
] as const;

function PaymentMark({ method }: { method: PaymentMethod }) {
  if (method === "Mastercard") {
    return (
      <span className="flex flex-col items-center gap-1">
        <span className="flex -space-x-2">
          <span className="size-5 rounded-full bg-[#d87559]" />
          <span className="size-5 rounded-full bg-[#dca958]/85" />
        </span>
        <span className="text-[0.5rem] font-semibold tracking-tight">
          mastercard
        </span>
      </span>
    );
  }

  if (method === "Visa") {
    return (
      <span className="text-xl font-extrabold tracking-[-0.08em] text-[#48527a] italic">
        VISA
      </span>
    );
  }

  if (method === "Amazon Pay") {
    return (
      <span className="text-sm font-semibold tracking-tight">
        amazon <span className="text-[#b87545]">pay</span>
      </span>
    );
  }

  if (method === "PayPal") {
    return (
      <span className="text-base font-bold tracking-[-0.04em] text-[#52637a]">
        Pay<span className="text-[#7291a8]">Pal</span>
      </span>
    );
  }

  if (method === "Klarna") {
    return (
      <span className="text-base font-bold tracking-[-0.04em] text-[#765f68]">
        Klarna.
      </span>
    );
  }

  return (
    <span className="text-[0.65rem] font-bold tracking-[0.12em] uppercase">
      Vorkasse
    </span>
  );
}

export function StoreFooter({
  branding,
  footerNavigation,
  serviceNavigation,
}: StoreFooterProps) {
  const categoryLinks = footerNavigation.flatMap(getNavigationLinks);
  const serviceLinks = serviceNavigation.flatMap(getNavigationLinks);

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
          <ContractRevocationDialog />
        </section>

        <div className="col-span-2 grid gap-x-10 gap-y-10 sm:grid-cols-3 xl:col-span-3">
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

          <div className="grid gap-8 border-t border-[#d9d7ce] pt-7 sm:col-span-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <section aria-labelledby="payment-methods-heading">
              <h2
                className="text-xs font-semibold tracking-[0.16em] text-[#72786f] uppercase"
                id="payment-methods-heading"
              >
                Zahlungsarten
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                  <li
                    className="flex h-10 min-w-18 items-center justify-center rounded-xl border border-[#ded9cd] bg-[#fffdf8] px-3 text-[#51584f]"
                    key={method}
                  >
                    <PaymentMark method={method} />
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="social-networks-heading">
              <h2
                className="text-xs font-semibold tracking-[0.16em] text-[#72786f] uppercase"
                id="social-networks-heading"
              >
                Soziale Netzwerke
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <a
                    aria-label={`${label} (öffnet in einem neuen Tab)`}
                    className="flex size-10 items-center justify-center rounded-full border border-[#d6d9cf] bg-[#f8f7f1] text-[#525b52] transition-[background,border-color,color,transform] hover:border-[#c98b71] hover:bg-[#f1ded3] hover:text-[#a8563c] focus-visible:ring-3 focus-visible:ring-[#cf7859]/30 motion-safe:active:translate-y-px"
                    href={href}
                    key={label}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    <span className="sr-only">{label}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-360 border-t px-6 py-6 text-xs text-muted-foreground sm:px-8">
        <span>
          © {new Date().getFullYear()} JVMöbel. Alle Rechte vorbehalten.
        </span>
      </div>
    </footer>
  );
}
