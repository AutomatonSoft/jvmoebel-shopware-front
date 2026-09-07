import type { StoreNavigationItem } from "@/features/storefront-shell/model/navigation";

export const mainNavigationMock = [
  {
    id: "new-in",
    label: "Neuheiten",
    href: "/new-in",
    children: [],
  },
  {
    id: "living",
    label: "Wohnzimmer",
    href: "/living",
    children: [
      {
        id: "sofas",
        label: "Sofas",
        href: "/living/sofas",
        children: [],
      },
      {
        id: "armchairs",
        label: "Sessel",
        href: "/living/armchairs",
        children: [],
      },
    ],
  },
  {
    id: "dining",
    label: "Esszimmer",
    href: "/dining",
    children: [],
  },
  {
    id: "bedroom",
    label: "Schlafzimmer",
    href: "/bedroom",
    children: [],
  },
  {
    id: "storage",
    label: "Stauraum",
    href: "/storage",
    children: [],
  },
  {
    id: "sale",
    label: "Angebote",
    href: "/sale",
    children: [],
  },
] satisfies StoreNavigationItem[];

export const footerNavigationMock = [
  {
    id: "footer-categories",
    label: "Kategorien",
    href: "/shop",
    children: [
      {
        id: "footer-special-offers",
        label: "Sonderangebote",
        href: "/sale",
        children: [],
      },
      {
        id: "footer-chesterfield",
        label: "Chesterfield-Welt",
        href: "/chesterfield",
        children: [],
      },
      {
        id: "footer-sofas",
        label: "Sofas & Couches",
        href: "/living/sofas",
        children: [],
      },
      {
        id: "footer-ready-to-ship",
        label: "Möbel sofort lieferbar",
        href: "/new-in",
        children: [],
      },
      {
        id: "footer-classic-furniture",
        label: "Klassische Möbel",
        href: "/klassische-moebel",
        children: [],
      },
      {
        id: "footer-living",
        label: "Wohnzimmer",
        href: "/living",
        children: [],
      },
      {
        id: "footer-dining",
        label: "Esszimmer",
        href: "/dining",
        children: [],
      },
      {
        id: "footer-office",
        label: "Büro",
        href: "/office",
        children: [],
      },
      {
        id: "footer-bedroom",
        label: "Schlafzimmer",
        href: "/bedroom",
        children: [],
      },
      {
        id: "footer-kids",
        label: "Kinder",
        href: "/kids",
        children: [],
      },
      {
        id: "footer-steel-furniture",
        label: "Stahlmöbel",
        href: "/stahlmoebel",
        children: [],
      },
      {
        id: "footer-italian-furniture",
        label: "Italienische Möbel",
        href: "/italienische-moebel",
        children: [],
      },
      {
        id: "footer-solid-wood-furniture",
        label: "Massivholzmöbel",
        href: "/massivholzmoebel",
        children: [],
      },
      {
        id: "footer-decoration",
        label: "Dekoration",
        href: "/dekoration",
        children: [],
      },
      {
        id: "footer-hallway-bathroom",
        label: "Flur & Bad",
        href: "/flur-bad",
        children: [],
      },
      {
        id: "footer-lighting",
        label: "Lampen",
        href: "/lampen",
        children: [],
      },
      {
        id: "footer-kitchens",
        label: "Küchen",
        href: "/kuechen",
        children: [],
      },
      {
        id: "footer-garden",
        label: "Garten & Terrasse",
        href: "/garten-terrasse",
        children: [],
      },
      {
        id: "footer-wall-panels",
        label: "Wandverkleidung",
        href: "/wandverkleidung",
        children: [],
      },
      {
        id: "footer-hospitality",
        label: "Gastronomie & Hotellerie",
        href: "/gastronomie-hotellerie",
        children: [],
      },
      {
        id: "footer-outdoor-wellness",
        label: "Grillkota, Sauna, Camping & Whirlpool",
        href: "/grillkota-sauna-camping-whirlpool",
        children: [],
      },
      {
        id: "footer-bestsellers",
        label: "Bestseller",
        href: "/bestseller",
        children: [],
      },
      {
        id: "footer-leisure-health",
        label: "Freizeit & Gesundheit",
        href: "/freizeit-gesundheit",
        children: [],
      },
      {
        id: "footer-rugs",
        label: "Teppiche & Läufer",
        href: "/teppiche-laeufer",
        children: [],
      },
      {
        id: "footer-electronics-advertising",
        label: "Elektronik & Werbemittel",
        href: "/elektronik-werbemittel",
        children: [],
      },
      {
        id: "footer-building-renovation",
        label: "Bau- & Renovierungsbedarf",
        href: "/bau-renovierungsbedarf",
        children: [],
      },
    ],
  },
] satisfies StoreNavigationItem[];

export const serviceNavigationMock = [
  {
    id: "privacy",
    label: "Datenschutz",
    href: "/privacy",
    children: [],
  },
  {
    id: "imprint",
    label: "Impressum",
    href: "/imprint",
    children: [],
  },
  {
    id: "revocation",
    label: "Widerruf",
    href: "https://www.jvmoebel.de/Infos/Widerruf.htm",
    children: [],
  },
  {
    id: "terms",
    label: "AGB",
    href: "/terms",
    children: [],
  },
  {
    id: "jvmoebel",
    label: "JVMöbel",
    href: "/",
    children: [],
  },
] satisfies StoreNavigationItem[];
