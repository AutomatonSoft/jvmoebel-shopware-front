import type { StorefrontFooterContent } from "@/features/storefront-shell/model/footer";

export const defaultStorefrontFooterContent = {
  about: {
    description:
      "Wir bieten unseren Kunden schönes und praktisches für Haus und Garten. Die Produktpalette ist breit gefächert. Von handgefertigten Ledersofas über klassische Chesterfield wie stylische Wohnmöbel bis zu den eigen gefertigten Designer Garnituren ist alles dabei, was das Einrichterherz begehrt. Das stetig wachsende Auftragsvolumen schultert das Team von jvmoebel.de mittels modernster Technologien und durchdachten Strukturen mit Spaß und Motivation. Masse – aber bitte mit Klasse ist das Motto, das von unseren Mitarbeitern Tag für Tag gelebt wird. Schließen Sie sich der Gemeinschaft unserer zufriedenen Kunden an. Ihr gemütliches Heim ist unser Ziel!",
    eyebrow: "Über uns",
    title: "Möbel mit Charakter, gemacht für das echte Leben.",
  },
  copyright: "© {year} {storeName}. Alle Rechte vorbehalten.",
  headings: {
    categories: "Kategorien",
    paymentMethods: "Zahlungsarten",
    service: "Service",
    socialLinks: "Soziale Netzwerke",
  },
  paymentMethods: [
    {
      id: "mastercard",
      label: "Mastercard",
      media: { alt: "Mastercard", url: "/images/icons/mastercard.webp" },
    },
    {
      id: "visa",
      label: "Visa",
      media: { alt: "Visa", url: "/images/icons/visa.webp" },
    },
    {
      id: "vorkasse",
      label: "Vorkasse",
      media: { alt: "Vorkasse", url: "/images/icons/vorkasse.webp" },
    },
    {
      id: "amazon-pay",
      label: "Amazon Pay",
      media: { alt: "Amazon Pay", url: "/images/icons/amazon.webp" },
    },
    {
      id: "paypal",
      label: "PayPal",
      media: { alt: "PayPal", url: "/images/icons/paypal.webp" },
    },
    {
      id: "klarna",
      label: "Klarna",
      media: { alt: "Klarna", url: "/images/icons/klarna.webp" },
    },
  ],
  revocation: {
    buttonLabel: "Vertrag widerrufen",
    description:
      "Geben Sie Ihre Vertragsdaten ein. Wir bereiten daraus eine E-Mail an JVMöbel vor.",
    disclaimer:
      "Der Widerruf wird erst versendet, wenn Sie die vorbereitete E-Mail in Ihrem E-Mail-Programm abschicken.",
    enabled: true,
    recipient: "info@jvmoebel.de",
    submitLabel: "Widerruf per E-Mail vorbereiten",
    title: "Vertrag widerrufen",
  },
  socialLinks: [
    {
      id: "facebook",
      label: "Facebook",
      media: { alt: "Facebook", url: "/images/icons/facebook.png" },
      openInNewTab: true,
      url: "https://www.facebook.com/jvmoebel.de",
    },
    {
      id: "instagram",
      label: "Instagram",
      media: { alt: "Instagram", url: "/images/icons/instagram.png" },
      openInNewTab: true,
      url: "https://www.instagram.com/home_luxus_style_design/",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      media: { alt: "WhatsApp", url: "/images/icons/whatsapp.png" },
      openInNewTab: true,
      url: "https://api.whatsapp.com/message/I5VAPEHCQNQTM1?autoload=1&app_absent=0",
    },
    {
      id: "youtube",
      label: "YouTube",
      media: { alt: "YouTube", url: "/images/icons/youtube.png" },
      openInNewTab: true,
      url: "https://www.youtube.com/channel/UClp5F2jZKfTJG1o902C1-eQ",
    },
    {
      id: "pinterest",
      label: "Pinterest",
      media: { alt: "Pinterest", url: "/images/icons/pinterest.png" },
      openInNewTab: true,
      url: "https://www.pinterest.de/jvmoebel_de",
    },
    {
      id: "telegram",
      label: "Telegram",
      media: { alt: "Telegram", url: "/images/icons/telegram.png" },
      openInNewTab: true,
      url: "https://t.me/XLANDJV",
    },
  ],
} satisfies StorefrontFooterContent;
