import type { StoreNavigationItem } from "@/features/storefront-shell/model/navigation";

export const mainNavigationMock = [
  {
    id: "new-in",
    label: "Neuheiten",
    href: "/neuheiten",
    children: [],
  },
  {
    id: "living",
    label: "Wohnzimmer",
    href: "/wohnzimmer",
    children: [
      {
        id: "sofas",
        label: "Sofas",
        href: "/wohnzimmer/sofas",
        children: [],
      },
      {
        id: "armchairs",
        label: "Sessel",
        href: "/wohnzimmer/sessel",
        children: [],
      },
    ],
  },
  {
    id: "dining",
    label: "Esszimmer",
    href: "/esszimmer",
    children: [],
  },
  {
    id: "bedroom",
    label: "Schlafzimmer",
    href: "/schlafzimmer",
    children: [],
  },
  {
    id: "storage",
    label: "Stauraum",
    href: "/stauraum",
    children: [],
  },
  {
    id: "sale",
    label: "Angebote",
    href: "/rabatt-angebote",
    children: [],
  },
] satisfies StoreNavigationItem[];

export const footerNavigationMock = [
  {
    id: "footer-categories",
    label: "Kategorien",
    href: "/moebel-sortiment",
    children: [
      {
        id: "footer-special-offers",
        label: "Sonderangebote",
        href: "/rabatt-angebote",
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
        href: "/wohnzimmer/sofas",
        children: [],
      },
      {
        id: "footer-ready-to-ship",
        label: "Möbel sofort lieferbar",
        href: "/neuheiten",
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
        href: "/wohnzimmer",
        children: [],
      },
      {
        id: "footer-dining",
        label: "Esszimmer",
        href: "/esszimmer",
        children: [],
      },
      {
        id: "footer-office",
        label: "Büro",
        href: "/buero",
        children: [],
      },
      {
        id: "footer-bedroom",
        label: "Schlafzimmer",
        href: "/schlafzimmer",
        children: [],
      },
      {
        id: "footer-kids",
        label: "Kinder",
        href: "/kinder",
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
    href: "/datenschutz",
    children: [],
  },
  {
    id: "imprint",
    label: "Impressum",
    href: "/impressum",
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
    href: "/agb",
    children: [],
  },
  {
    id: "jvmoebel",
    label: "JVMöbel",
    href: "/",
    children: [],
  },
] satisfies StoreNavigationItem[];
