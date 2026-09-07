import type { CmsPage } from "@/features/cms/model/page";

const pageId = "mock-home-page";
const sectionId = "mock-home-section";
const heroBlockId = "mock-home-hero-block";
const categoryRailBlockId = "mock-home-category-rail-block";
const shopTheLookBlockId = "mock-home-shop-the-look-block";
const roomGridBlockId = "mock-home-room-grid-block";
const productGridBlockId = "mock-home-product-grid-block";
const whyJvmoebelBlockId = "mock-home-why-jvmoebel-block";
const homeEditorialBlockId = "mock-home-editorial-block";
const newsletterBlockId = "mock-home-newsletter-block";

export const homeCmsPageMock = {
  id: pageId,
  type: "page",
  sections: [
    {
      id: sectionId,
      position: 0,
      sizingMode: "full_width",
      type: "default",
      blocks: [
        {
          id: heroBlockId,
          position: 0,
          type: "jv-hero",
          slots: [
            {
              id: "mock-home-hero-slot",
              slot: "content",
              type: "jv-hero",
              data: {
                ariaLabel: "Aktuelle Angebote und Wohnideen",
                autoplay: true,
                autoplayIntervalMs: 6500,
                slides: {
                  livingRoom: {
                    description:
                      "Entdecken Sie ausgewählte Sofas, Tische und Wohnideen für ein Zuhause mit Persönlichkeit.",
                    eyebrow: "Neue Wohnideen",
                    id: "hero-living-room",
                    image: {
                      alt: "Helles Wohnzimmer mit einem großzügigen Sofa",
                      url: "/images/main/hero-editorial.webp",
                    },
                    layout: "featured",
                    position: 0,
                    primaryLink: {
                      label: "Wohnzimmer entdecken",
                      size: "large",
                      url: "/wohnzimmer",
                    },
                    promotion: {
                      label: "Ausgewählte Kollektionen",
                      value: "Bis zu 20 %",
                    },
                    secondaryLink: {
                      label: "Alle Möbel ansehen",
                      size: "medium",
                      url: "/moebel-sortiment",
                    },
                    title: "Wohnzimmer, die sich nach Ihnen anfühlen.",
                  },
                  nomaChair: {
                    eyebrow: "Neu eingetroffen",
                    id: "hero-noma-chair",
                    image: {
                      alt: "Noma Loungesessel aus rostfarbenem Bouclé",
                      url: "/images/main/lounge-chair.webp",
                    },
                    layout: "caption",
                    position: 1,
                    primaryLink: {
                      label: "Noma entdecken",
                      size: "large",
                      url: "/produkt/noma",
                    },
                    promotion: {
                      value: "895 €",
                    },
                    title: "Noma Loungesessel zum Einführungspreis",
                  },
                  diningRoom: {
                    eyebrow: "Nur für kurze Zeit",
                    id: "hero-dining-room",
                    image: {
                      alt: "Esszimmer mit rundem Holztisch und gepolsterten Stühlen",
                      url: "/images/main/dining-room.webp",
                    },
                    layout: "caption",
                    position: 2,
                    primaryLink: {
                      label: "Jetzt sparen",
                      size: "large",
                      url: "/rabatt-angebote",
                    },
                    promotion: {
                      value: "-15 %",
                    },
                    title: "Sale-Specials fürs Esszimmer mit bis zu",
                  },
                },
              },
            },
          ],
        },
        {
          id: categoryRailBlockId,
          position: 1,
          type: "jv-category-rail",
          slots: [
            {
              id: "mock-home-category-rail-slot",
              slot: "content",
              type: "jv-category-rail",
              data: {
                categories: {
                  sofas: {
                    id: "popular-sofas",
                    image: {
                      alt: "Helles Sofa in einem warmen Wohnzimmer",
                      url: "/images/main/hero-living.webp",
                    },
                    label: "Sofas & Couches",
                    position: 0,
                    url: "/wohnzimmer/sofas",
                  },
                  armchairs: {
                    id: "popular-armchairs",
                    image: {
                      alt: "Rostroter Loungesessel",
                      url: "/images/main/lounge-chair.webp",
                    },
                    label: "Sessel",
                    position: 1,
                    url: "/wohnzimmer/sessel",
                  },
                  diningTables: {
                    id: "popular-dining-tables",
                    image: {
                      alt: "Esstisch aus dunklem Holz",
                      url: "/images/main/dining-room.webp",
                    },
                    label: "Esstische",
                    position: 2,
                    url: "/esszimmer/esstische",
                  },
                  beds: {
                    id: "popular-beds",
                    image: {
                      alt: "Ruhiges Schlafzimmer in hellen Naturtönen",
                      url: "/images/main/bedroom.webp",
                    },
                    label: "Betten",
                    position: 3,
                    url: "/schlafzimmer/betten",
                  },
                  tvFurniture: {
                    id: "popular-tv-furniture",
                    image: {
                      alt: "TV-Lowboard aus Walnussholz",
                      url: "/images/main/media-console.webp",
                    },
                    label: "TV-Möbel",
                    position: 4,
                    url: "/wohnzimmer/tv-moebel",
                  },
                  newArrivals: {
                    id: "popular-new-arrivals",
                    image: {
                      alt: "Neue Möbelkollektion in einem hellen Interieur",
                      url: "/images/main/hero-editorial.webp",
                    },
                    label: "Neuheiten",
                    position: 5,
                    url: "/neuheiten",
                  },
                },
                description:
                  "Direkt zu den Möbeln, die Ihr Zuhause besonders machen.",
                eyebrow: "Schnell entdecken",
                title: "Beliebte Kategorien",
                viewAll: {
                  label: "Alle Kategorien",
                  url: "/moebel-sortiment",
                },
              },
            },
          ],
        },
        {
          id: shopTheLookBlockId,
          position: 2,
          type: "jv-shop-the-look",
          slots: [
            {
              id: "mock-home-shop-the-look-slot",
              slot: "content",
              type: "jv-shop-the-look",
              data: {
                description:
                  "Entdecken Sie die Möbel dieses Wohnzimmers und stellen Sie den Look passend zu Ihrem Zuhause zusammen.",
                eyebrow: "Ein Raum, ein Look",
                image: {
                  alt: "Helles Wohnzimmer mit Sofa, Loungesessel und TV-Lowboard",
                  url: "/images/main/hero-living.webp",
                },
                items: {
                  sofa: {
                    description: "Naturfarbenes Bouclé · modular kombinierbar",
                    hotspot: { x: 69, y: 66 },
                    id: "look-alba-sofa",
                    name: "Alba Modulsofa",
                    position: 0,
                    url: "/produkt/alba",
                  },
                  armchair: {
                    description: "Rostrotes Bouclé · weiche Rundungen",
                    hotspot: { x: 85, y: 79 },
                    id: "look-noma-armchair",
                    name: "Noma Loungesessel",
                    position: 1,
                    url: "/produkt/noma",
                  },
                  lowboard: {
                    description: "Dunkles Holz · klare Linien",
                    hotspot: { x: 63, y: 55 },
                    id: "look-forma-lowboard",
                    name: "Forma TV-Lowboard",
                    position: 2,
                    url: "/produkt/forma",
                  },
                },
                title: "Diesen Look nach Hause holen.",
                viewAll: {
                  label: "Wohnzimmer entdecken",
                  url: "/wohnzimmer",
                },
              },
            },
          ],
        },
        {
          id: roomGridBlockId,
          position: 3,
          type: "jv-room-grid",
          slots: [
            {
              id: "mock-home-room-grid-slot",
              slot: "content",
              type: "jv-room-grid",
              data: {
                eyebrow: "Nach Räumen entdecken",
                title: "Möbel für jeden Raum.",
                description:
                  "Beginnen Sie mit dem Raum, den Sie einrichten möchten, und entdecken Sie Möbel, die harmonisch zusammenspielen.",
                rooms: {
                  livingRoom: {
                    featured: 1,
                    id: "living-room",
                    image: {
                      alt: "Modern eingerichtetes Wohnzimmer",
                      url: "/images/main/hero-living.webp",
                    },
                    label: "Wohnzimmer",
                    position: 0,
                    title: "Sofas, Sessel & Tische",
                    url: "/wohnzimmer",
                  },
                  diningRoom: {
                    featured: 0,
                    id: "dining-room",
                    image: {
                      alt: "Warm eingerichtetes Esszimmer mit Walnussholz",
                      url: "/images/main/dining-room.webp",
                    },
                    label: "Esszimmer",
                    position: 1,
                    title: "Tische, Stühle & Stauraum",
                    url: "/esszimmer",
                  },
                  bedroom: {
                    featured: 0,
                    id: "bedroom",
                    image: {
                      alt: "Ruhiges Schlafzimmer in neutralen Farben",
                      url: "/images/main/bedroom.webp",
                    },
                    label: "Schlafzimmer",
                    position: 2,
                    title: "Betten, Nachttische & Kleiderschränke",
                    url: "/schlafzimmer",
                  },
                },
              },
            },
          ],
        },
        {
          id: productGridBlockId,
          position: 4,
          type: "jv-product-grid",
          slots: [
            {
              id: "mock-home-product-grid-slot",
              slot: "content",
              type: "jv-product-grid",
              data: {
                currency: "EUR",
                eyebrow: "Für Sie ausgewählt",
                locale: "de-DE",
                products: {
                  alba: {
                    badge: "Bestseller",
                    calculatedPrice: {
                      listPrice: {
                        price: 2890,
                      },
                      unitPrice: 2490,
                    },
                    cover: {
                      media: {
                        alt: "Alba Modulsofa in einem warm eingerichteten Wohnzimmer",
                        url: "/images/main/hero-living.webp",
                      },
                    },
                    id: "alba",
                    position: 0,
                    ratingAverage: 4.9,
                    reviewCount: 128,
                    translated: {
                      description: "Naturfarbenes Bouclé · 4-Sitzer",
                      name: "Alba Modulsofa",
                    },
                    url: "/produkt/alba",
                  },
                  noma: {
                    badge: "Neu",
                    calculatedPrice: {
                      unitPrice: 895,
                    },
                    cover: {
                      media: {
                        alt: "Noma Loungesessel in Rostrot",
                        url: "/images/main/lounge-chair.webp",
                      },
                    },
                    id: "noma",
                    position: 1,
                    ratingAverage: 4.8,
                    reviewCount: 64,
                    translated: {
                      description: "Rostrotes Bouclé · Walnussholz",
                      name: "Noma Loungesessel",
                    },
                    url: "/produkt/noma",
                  },
                  forma: {
                    badge: "Nur noch wenige verfügbar",
                    calculatedPrice: {
                      unitPrice: 1290,
                    },
                    cover: {
                      media: {
                        alt: "Forma TV-Lowboard aus massivem Walnussholz",
                        url: "/images/main/media-console.webp",
                      },
                    },
                    id: "forma",
                    position: 2,
                    ratingAverage: 4.7,
                    reviewCount: 39,
                    translated: {
                      description: "Massives Walnussholz · 180 cm",
                      name: "Forma TV-Lowboard",
                    },
                    url: "/produkt/forma",
                  },
                  mira: {
                    badge: "Angebot",
                    calculatedPrice: {
                      listPrice: {
                        price: 1950,
                      },
                      unitPrice: 1650,
                    },
                    cover: {
                      media: {
                        alt: "Mira Tisch in einem warm eingerichteten Esszimmer",
                        url: "/images/main/dining-room.webp",
                      },
                    },
                    id: "mira",
                    position: 3,
                    ratingAverage: 4.9,
                    reviewCount: 81,
                    translated: {
                      description: "Geräucherte Eiche · Ø 140 cm",
                      name: "Mira Esstisch",
                    },
                    url: "/produkt/mira",
                  },
                },
                title: "Ausgewählte Möbelstücke",
                viewAll: {
                  label: "Alle Produkte ansehen",
                  url: "/moebel-sortiment",
                },
              },
            },
          ],
        },
        {
          id: whyJvmoebelBlockId,
          position: 5,
          type: "jv-why-jvmoebel",
          slots: [
            {
              id: "mock-home-why-jvmoebel-slot",
              slot: "content",
              type: "jv-why-jvmoebel",
              data: {
                benefits: {
                  design: {
                    description:
                      "Ausdrucksstarke Formen und angenehme Materialien für ein Zuhause mit Charakter.",
                    icon: "design",
                    id: "why-jvmoebel-design",
                    position: 0,
                    title: "Ausgewählte Designs",
                    url: "/moebel-sortiment",
                  },
                  advice: {
                    description:
                      "Persönliche Hilfe bei Auswahl, Kombination und Bestellung.",
                    icon: "advice",
                    id: "why-jvmoebel-advice",
                    position: 1,
                    title: "Persönliche Beratung",
                    url: "/kontakt",
                  },
                  payment: {
                    description:
                      "Vertraute Zahlungsarten und ein transparenter Bestellprozess.",
                    icon: "payment",
                    id: "why-jvmoebel-payment",
                    position: 2,
                    title: "Sicher bezahlen",
                    url: "/zahlungsarten",
                  },
                },
                description:
                  "Wir verbinden charakterstarkes Design mit persönlichem Service und einem Einkauf, der sich einfach und verlässlich anfühlt.",
                eyebrow: "Mehr als nur Möbel",
                mark: "JVM",
                tagline: "Für Räume mit Persönlichkeit",
                title: "Warum JVMöbel?",
                viewAll: {
                  label: "Mehr über JVMöbel",
                  url: "/ueber-uns",
                },
              },
            },
          ],
        },
        {
          id: homeEditorialBlockId,
          position: 6,
          type: "jv-home-editorial",
          slots: [
            {
              id: "mock-home-editorial-slot",
              slot: "content",
              type: "jv-home-editorial",
              data: {
                introduction: [
                  "In unserem umfassenden Sortiment mit über 60.000 Artikeln finden Sie mühelos <a href='/moebel-sortiment'>trendige und preiswerte Möbel</a>, bezaubernde Lieblingsstücke und Inspirationen für die Gestaltung Ihres Zuhauses. Neben modernen und weichen <a href='/wohnzimmer/sofas'>Eckcouchen</a> bieten wir diese auch in verschiedenen Größen an. Ob <a href='/kinder'>Kinderzimmer Möbel</a>, <a href='/esszimmer'>Esszimmer Möbel</a>, <a href='/wohnzimmer'>Wohnzimmer Möbel</a>, <a href='/schlafzimmer'>Schlafzimmer Möbel</a> oder <a href='/buero'>Büro Möbel</a> – unsere Möbel bieten wir online nun seit gut 20 Jahren an.",
                  "Verleihen Sie Ihrem Zuhause mit hochwertigen <a href='/moebel-sortiment'>Möbeln</a>, <a href='/lampen'>Lampen</a> und <a href='/dekoration'>Wohnaccessoires</a> den gewünschten Stil. Unser Angebot umfasst moderne Möbel zu unschlagbaren Preisen, namhafte Marken, erstklassige Materialien und exklusive Markenneuheiten. Dies und vieles mehr erwartet Sie in unserem <a href='/moebel-sortiment'>Online-Möbelhaus</a>.",
                ],
                sections: {
                  assortment: {
                    id: "editorial-assortment",
                    paragraphs: [
                      "Möbel günstig kaufen, da sind Sie genau richtig bei uns. Moderne <a href='/wohnzimmer'>Wohnzimmer Einrichtung</a> oder ausgefallene <a href='/wohnzimmer/sofas'>Big Sofa</a> machen Ihren Traum vom schönen Wohnen wahr. In unserer traumhaften <a href='/wohnzimmer/sofas'>Polsterwelt</a> finden Sie zahlreiche Möbelstücke wie <a href='/stauraum'>Wohnwand</a>, <a href='/wohnzimmer/sofas'>Wohnlandschaft U Form</a> und <a href='/stauraum'>günstige Sideboards</a>. Oft sind die Wohnlandschaften beleuchtet und sehr ausgefallen. Auch für den Essbereich finden Sie alles, was Ihr Herz begehrt. Von <a href='/esszimmer'>Esszimmerstühlen</a> bis zu kompletten <a href='/esszimmer'>Essgarnituren</a> ist für jeden etwas dabei. Ein besonderes Merkmal in unserem Sortiment sind die <a href='/wohnzimmer'>Wohnzimmermöbel aus Italien</a>.",
                      "Auch für die kleinen Seelen unter uns haben wir besondere Einrichtungen für das <a href='/kinder'>Kinderzimmer</a>. Moderne oder klassische Möbel fürs Kinderzimmer sind ein Traum. Außer günstigen <a href='/kinder'>Kinderzimmermöbel</a> bieten wir auch Einzelstücke wie <a href='/kinder'>Kinder Kleiderschrank</a> und <a href='/kinder'>Kinderzimmer Regale</a>. Ob ein <a href='/kinder'>Kleiderschrank Kinderzimmer</a> für Mädchen oder kinderschränke Kinderzimmer für Jungs – Sie finden bei uns eine große Auswahl an günstigen Kinderzimmermöbeln. Außerdem bieten wir auch <a href='/kinder'>Doppelstockbetten</a> oder <a href='/kinder'>Etagenbetten</a> mit Regalen und Schränken an.",
                    ],
                    position: 0,
                  },
                  bedroom: {
                    id: "editorial-bedroom",
                    paragraphs: [
                      "Wussten Sie, dass Sie 25 bis 31 Jahre Ihres Lebens mit Schlafen verbringen? Lassen Sie sich von unseren <a href='/schlafzimmer'>Ideen für das Schlafzimmer</a> verzaubern und holen Sie sich diese direkt nach Hause. Neben den Schlafzimmermöbeln fürs Kind haben wir auch die Einrichtung für das Elternschlafzimmer. Neben ganzen <a href='/schlafzimmer'>Set-Schlafzimmer</a> bieten wir auch <a href='/schlafzimmer'>runde Betten</a> oder <a href='/schlafzimmer'>Chesterfield Betten</a> an. Neben klassischen Betten sind auch moderne Betten bei uns ein Bestseller. Ein besonderes Merkmal fällt hier auf die typischen <a href='/schlafzimmer'>Boxspringbetten</a>. Diese gibt es als klassische Betten mit Beleuchtung oder mit Metallverzierungen. Das <a href='/schlafzimmer'>Set-Schlafzimmer</a> kann bereits zu günstigen Preisen erworben werden. Natürlich bieten wir auch den <a href='/schlafzimmer'>Schlafzimmerschrank</a>, die <a href='/stauraum'>Kommode</a> oder das <a href='/stauraum'>Sideboard</a> einzeln an. Diese können nicht nur im modernen Schlafzimmer, sondern auch als Möbelstück im modernen oder klassischen Wohnzimmer verwendet werden. Der <a href='/schlafzimmer'>Schlafzimmerschrank</a> ist übrigens in verschiedenen Ausführungen erhältlich, z.B. sechstürige oder viertürige Schränke. Lassen Sie sich von uns beraten und richten Sie Ihr Schlafzimmer modern oder klassisch ein.",
                    ],
                    position: 1,
                    title: "Gesund und schön schlafen! Schönes Schlafzimmer",
                  },
                  diningRoom: {
                    id: "editorial-dining-room",
                    paragraphs: [
                      "Wussten Sie, dass Sie 2,50 bis 5,00 Jahre Ihres Lebens mit Essen verbringen? Ein großer Blickfang sind auch unsere Möbel im <a href='/esszimmer'>Essbereich</a>. Klassische <a href='/esszimmer'>Chesterfield Esszimmer Garnituren</a> oder moderne <a href='/esszimmer'>Essgruppen</a> werden auch als <a href='/esszimmer'>Esstisch Stühle Set</a> angeboten. Neben ganzen Wohnideen für das Esszimmer bieten wir direkte Inspiration, passende Stühle, Hocker, Sessel, Bänke oder Esstische zu finden. Wir empfehlen die <a href='/esszimmer'>Epoxidharz-Tische</a>. Diese sind blau gehalten und ein echter Blickfang für Ihre Nachbarn.",
                    ],
                    position: 2,
                    title: "Eine schöne Wohnzimmergarnitur für Sie",
                  },
                  additionalRanges: {
                    id: "editorial-additional-ranges",
                    paragraphs: [
                      "Wussten Sie, dass ein Mensch bis zu 2,50 Jahre seines Lebens im <a href='/badezimmer'>Badezimmer</a> verbringt? Ein schönes Badezimmer sollte zu Ihrer Mindestausstattung gehören. Unser Angebot an <a href='/badezimmer'>Waschtischen</a>, <a href='/badezimmer'>Badezimmermöbeln und Badmöbeln</a> wird Sie begeistern.",
                      "Wussten Sie, dass der Mensch im Jahr über 45 Jahre im <a href='/buero'>Büro</a> verbringen kann? Diese Tatsache sollte einem zu denken geben, ob man nicht sein Leben mit einer schönen <a href='/buero'>Büroeinrichtung</a> genießt. JVmoebel bietet eine große Auswahl an <a href='/buero'>Büro Schreibtischen</a>. Dazu finden Sie auch den passenden <a href='/buero'>Aktenschrank</a>. Die breite Auswahl an Büroausstattung finden Sie als <a href='/buero'>modernes Büro</a> oder als <a href='/buero'>klassisches Büro</a>. Das Ganze gibt es auch als <a href='/buero'>Büro Möbel Set</a> zur Auswahl. Für unsere gewerblichen Kunden bieten wir spezielle Angebote an. Lassen Sie sich hier zu unserer <a href='/gewerbekunden'>Hotel Einrichtung</a> durch unseren <a href='/gewerbekunden'>Hotelzimmer Einrichter</a> beraten. Unser Angebot mit <a href='/gewerbekunden'>Lounge, Club oder Zimmer Möbel</a> wird Ihrem Hotel einen neuen Touch verleihen.",
                    ],
                    position: 3,
                  },
                },
                showLessLabel: "Weniger anzeigen",
                showMoreLabel: "Alles anzeigen",
                statement:
                  "Der von uns angebotene Service für unsere geschätzten Kunden zeichnet sich durch höchste Qualität und herausragende Merkmale aus.",
                title:
                  "Willkommen bei JV Möbel – Ihrem Online-Möbelhaus für Design & Qualität",
              },
            },
          ],
        },
        {
          id: newsletterBlockId,
          position: 7,
          type: "jv-newsletter",
          slots: [
            {
              id: "mock-home-newsletter-slot",
              slot: "content",
              type: "jv-newsletter",
              data: {
                buttonLabel: "Anmelden",
                buttonSize: "large",
                description:
                  "Einrichtungstipps, Materialpflege und früher Zugang zu neuen Möbelstücken. Keine täglichen E-Mails.",
                errorMessage:
                  "Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
                eyebrow: "Der Newsletter für schönes Wohnen",
                invalidEmailMessage:
                  "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
                placeholder: "Ihre E-Mail-Adresse",
                storefrontUrl: "http://localhost:3000",
                successMessage: "Sie sind dabei. Willkommen zu Hause.",
                title: "Gute Ideen, gelegentlich.",
              },
            },
          ],
        },
      ],
    },
  ],
} satisfies CmsPage;
