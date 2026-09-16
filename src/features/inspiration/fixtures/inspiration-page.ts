import type { CmsBlock, CmsPage } from "@/features/cms/model/page";

function createCmsBlock(
  type: string,
  position: number,
  data: unknown,
): CmsBlock {
  return {
    id: "mock-inspiration-" + type + "-" + position + "-block",
    position,
    slots: [
      {
        data,
        id: "mock-inspiration-" + type + "-" + position + "-slot",
        slot: "content",
        type,
      },
    ],
    type,
  };
}

export const inspirationCmsPageMock = {
  id: "mock-inspiration-page",
  sections: [
    {
      blocks: [
        createCmsBlock("jv-hero", 0, {
          ariaLabel: "Wohnideen und Inspiration für Ihr Zuhause",
          autoplay: false,
          headingLevel: "h1",
          slides: {
            inspiration: {
              description:
                "Entdecken Sie harmonische Raumkonzepte, aktuelle Wohntrends und Möbel, die aus einzelnen Ideen ein persönliches Zuhause machen.",
              eyebrow: "Wohnideen & Inspiration",
              id: "inspiration-welcome",
              image: {
                alt: "Elegantes Wohnzimmer mit hellem Sofa, Walnussholz und rostfarbenem Loungesessel",
                url: "/images/inspiration/inspiration-hero.webp",
              },
              layout: "featured",
              position: 0,
              primaryLink: {
                label: "Wohnzimmer entdecken",
                size: "large",
                url: "/wohnzimmer",
              },
              secondaryLink: {
                label: "Alle Möbel ansehen",
                size: "medium",
                url: "/moebel-sortiment",
              },
              title: "Räume, die zu Ihnen passen.",
            },
          },
        }),
        createCmsBlock("jv-chip-rail", 1, {
          chips: [
            {
              id: "living-room",
              label: "Wohnzimmer",
              position: 0,
              url: "/wohnzimmer",
            },
            {
              id: "bedroom",
              label: "Schlafzimmer",
              position: 1,
              url: "/schlafzimmer",
            },
            {
              id: "dining-room",
              label: "Esszimmer",
              position: 2,
              url: "/esszimmer",
            },
            {
              id: "office",
              label: "Büro",
              position: 3,
              url: "/buero",
            },
            {
              id: "kids-room",
              label: "Kinderzimmer",
              position: 4,
              url: "/kinder",
            },
            {
              id: "bathroom",
              label: "Badezimmer",
              position: 5,
              url: "/badezimmer",
            },
          ],
          eyebrow: "Direkt zum Lieblingsraum",
          title: "Welchen Raum möchten Sie neu gestalten?",
        }),
        createCmsBlock("jv-cross-room-section", 2, {
          eyebrow: "Inspiration nach Raum",
          rooms: [
            {
              description:
                "Sofas, Sessel und Tische für gemeinsame Zeit und ruhige Abende.",
              id: "living-room",
              image: {
                alt: "Helles Wohnzimmer mit Sofa und Loungesessel",
                url: "/images/main/hero-living.webp",
              },
              label: "Wohnzimmer",
              position: 0,
              title: "Komfort trifft Persönlichkeit",
              url: "/wohnzimmer",
            },
            {
              description:
                "Betten und Stauraum in ruhigen Farben für einen erholsamen Rückzugsort.",
              id: "bedroom",
              image: {
                alt: "Ruhiges Schlafzimmer in warmen Naturtönen",
                url: "/images/main/bedroom.webp",
              },
              label: "Schlafzimmer",
              position: 1,
              title: "Ankommen und abschalten",
              url: "/schlafzimmer",
            },
            {
              description:
                "Tische, Stühle und Stauraummöbel für lange Abende in guter Gesellschaft.",
              id: "dining-room",
              image: {
                alt: "Esszimmer mit rundem Holztisch und Polsterstühlen",
                url: "/images/main/dining-room.webp",
              },
              label: "Esszimmer",
              position: 2,
              title: "Ein Platz für alle",
              url: "/esszimmer",
            },
          ],
          title: "Ideen für jeden Raum.",
        }),
        createCmsBlock("jv-trend-look-grid", 3, {
          cards: [
            {
              description:
                "Weiche Formen, warme Naturtöne und großzügiger Komfort.",
              id: "soft-living",
              image: {
                alt: "Wohnzimmer mit weichen Formen und hellen Polstermöbeln",
                url: "/images/main/hero-editorial.webp",
              },
              position: 0,
              title: "Soft Living",
              url: "/wohnzimmer",
            },
            {
              description: "Dunkles Holz und klare Linien mit ruhiger Wirkung.",
              id: "modern-walnut",
              image: {
                alt: "TV-Lowboard aus dunklem Walnussholz",
                url: "/images/main/media-console.webp",
              },
              position: 1,
              title: "Modern Walnut",
              url: "/wohnzimmer/tv-moebel",
            },
            {
              description:
                "Rostfarbenes Bouclé als warmer Akzent im modernen Zuhause.",
              id: "warm-boucle",
              image: {
                alt: "Rostroter Loungesessel aus Bouclé",
                url: "/images/main/lounge-chair.webp",
              },
              position: 2,
              title: "Warm Bouclé",
              url: "/wohnzimmer/sessel",
            },
            {
              description:
                "Ausgewählte Möbel mit Preisvorteil stilvoll kombinieren.",
              id: "design-sale",
              image: {
                alt: "Stilvoll eingerichtetes Wohnzimmer mit Designmöbeln",
                url: "/images/offers/sale-living-room.webp",
              },
              position: 3,
              title: "Design im Sale",
              url: "/rabatt-angebote",
            },
          ],
          eyebrow: "Aktuelle Looks",
          title: "Wohntrends zum Nachstylen.",
        }),
        createCmsBlock("jv-shop-the-look", 4, {
          description:
            "Ein ausgewogenes Zusammenspiel aus hellen Polstern, warmem Holz und einem ausdrucksstarken Farbakzent.",
          eyebrow: "Ein Raum, ein Look",
          image: {
            alt: "Helles Wohnzimmer mit Sofa, Sessel und TV-Lowboard",
            url: "/images/main/hero-living.webp",
          },
          items: {
            sofa: {
              description: "Naturfarbenes Bouclé · modular kombinierbar",
              hotspot: { x: 69, y: 66 },
              id: "alba-sofa",
              name: "Alba Modulsofa",
              position: 0,
              url: "/produkt/alba",
            },
            armchair: {
              description: "Rostrotes Bouclé · weiche Rundungen",
              hotspot: { x: 85, y: 79 },
              id: "noma-armchair",
              name: "Noma Loungesessel",
              position: 1,
              url: "/produkt/noma",
            },
            lowboard: {
              description: "Dunkles Holz · klare Linien",
              hotspot: { x: 63, y: 55 },
              id: "forma-lowboard",
              name: "Forma TV-Lowboard",
              position: 2,
              url: "/produkt/forma",
            },
          },
          title: "Ein Wohnzimmer, drei Lieblingsstücke.",
          viewAll: {
            label: "Wohnzimmer entdecken",
            url: "/wohnzimmer",
          },
        }),
        createCmsBlock("jv-color-world-picker", 5, {
          colors: [
            {
              hex: "#d9cbb9",
              id: "cashmere",
              image: {
                alt: "Helles Wohnzimmer in warmen Kaschmirtönen",
                url: "/images/main/hero-editorial.webp",
              },
              name: "Kaschmir",
              position: 0,
              url: "/wohnzimmer",
            },
            {
              hex: "#8b4c37",
              id: "terracotta",
              image: {
                alt: "Loungesessel in einem warmen Terrakottaton",
                url: "/images/main/lounge-chair.webp",
              },
              name: "Terrakotta",
              position: 1,
              url: "/wohnzimmer/sessel",
            },
            {
              hex: "#5b4033",
              id: "walnut",
              image: {
                alt: "Esszimmer mit Möbeln aus dunklem Holz",
                url: "/images/main/dining-room.webp",
              },
              name: "Walnuss",
              position: 2,
              url: "/esszimmer",
            },
            {
              hex: "#d8d4c8",
              id: "natural-white",
              image: {
                alt: "Schlafzimmer in hellem Naturweiß",
                url: "/images/main/bedroom.webp",
              },
              name: "Naturweiß",
              position: 3,
              url: "/schlafzimmer",
            },
          ],
          description:
            "Beginnen Sie mit einer Farbstimmung und entdecken Sie Möbel, die sich harmonisch kombinieren lassen.",
          title: "Finden Sie Ihre Farbwelt.",
        }),
        createCmsBlock("jv-guide-hub-cards", 6, {
          cards: [
            {
              description:
                "Sehen Sie Materialien, Proportionen und Kombinationen direkt im Raum.",
              id: "video-inspiration",
              image: {
                alt: "Modern eingerichtetes Wohnzimmer im Video",
                url: "/images/main/hero-living.webp",
              },
              position: 0,
              title: "Wohnideen im Video",
              url: "/video-shop",
            },
            {
              description:
                "Vergleichen Sie Möbel für unterschiedliche Räume, Stile und Anforderungen.",
              id: "furniture-range",
              image: {
                alt: "Auswahl verschiedener Möbel für das Zuhause",
                url: "/images/main/hero-editorial.webp",
              },
              position: 1,
              title: "Das gesamte Sortiment",
              url: "/moebel-sortiment",
            },
            {
              description:
                "Lassen Sie sich bei der Auswahl und Planung persönlich unterstützen.",
              id: "interior-consultation",
              image: {
                alt: "Persönliche Beratung zu Möbeln und Raumgestaltung",
                url: "/images/offers/design-consultation.webp",
              },
              position: 2,
              title: "Einrichtungsberatung",
              url: "/Kontakt?thema=einrichtungsberatung",
            },
          ],
          eyebrow: "Planen & entdecken",
          title: "Von der ersten Idee zum fertigen Raum.",
        }),
        createCmsBlock("jv-instagram-style", 7, {
          caption:
            "Neue Wohnwelten, besondere Einzelstücke und Einblicke in unsere aktuellen Kollektionen.",
          handle: "@home_luxus_style_design",
          image: {
            alt: "Elegantes Wohnzimmer aus der JVMöbel Community",
            url: "/images/about/about-showroom.png",
          },
          link: {
            label: "Auf Instagram entdecken",
            url: "https://www.instagram.com/home_luxus_style_design/",
          },
        }),
        createCmsBlock("jv-newsletter", 8, {
          buttonLabel: "Jetzt anmelden",
          buttonSize: "large",
          description:
            "Erhalten Sie neue Wohnideen, ausgewählte Kollektionen und besondere Angebote direkt in Ihr Postfach.",
          errorMessage:
            "Die Anmeldung ist momentan nicht möglich. Bitte versuchen Sie es später erneut.",
          eyebrow: "Inspiration per E-Mail",
          invalidEmailMessage:
            "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
          placeholder: "Ihre E-Mail-Adresse",
          successMessage: "Vielen Dank für Ihre Anmeldung.",
          title: "Neue Ideen für Ihr Zuhause.",
        }),
      ],
      id: "mock-inspiration-section",
      position: 0,
      sizingMode: "full_width",
      type: "default",
    },
  ],
  type: "landingpage",
} satisfies CmsPage;
