import type { CmsBlock, CmsPage } from "@/features/cms/model/page";

function createCmsBlock(
  type: string,
  position: number,
  data: unknown,
  options: Readonly<{ config?: unknown; cssClass?: string }> = {},
): CmsBlock {
  return {
    cssClass: options.cssClass,
    id: `mock-about-${type}-${position}-block`,
    position,
    slots: [
      {
        config: options.config,
        data,
        id: `mock-about-${type}-${position}-slot`,
        slot: "content",
        type,
      },
    ],
    type,
  };
}

export const aboutCmsPageMock = {
  id: "mock-about-page",
  sections: [
    {
      blocks: [
        createCmsBlock("jv-page-header", 0, {
          description:
            "Moebel für höchste Ansprüche – von modernen Designs bis zu zeitlosen Klassikern.",
          eyebrow: "Über uns",
          title: "Mit JV Moebel wird Ihr Einrichtungstraum zur Realität.",
        }),
        createCmsBlock(
          "image",
          1,
          {
            media: {
              metaData: { height: 1467, width: 1467 },
              translated: {
                alt: "Klassisches Wohnzimmer mit einem weiß-goldenen Sofa",
                title: "Exklusive Moebel von JVMoebel",
              },
              url: "/images/about/about-showroom.png",
            },
          },
          {
            config: {
              displayMode: { source: "static", value: "cover" },
              fetchPriorityHigh: { source: "static", value: true },
              horizontalAlign: { source: "static", value: "center" },
              isDecorative: { source: "static", value: false },
              minHeight: { source: "static", value: "560px" },
              verticalAlign: { source: "static", value: "center" },
            },
            cssClass:
              "mx-2 overflow-hidden rounded-3xl bg-muted sm:mx-6 [&_[data-cms-element=image]>span]:max-h-[70svh]",
          },
        ),
        createCmsBlock("jv-why-jvmoebel", 2, {
          benefits: [
            {
              description:
                "Mit einer beeindruckenden Auswahl von über 70.000 Moebelstücken bieten wir Ihnen alles, was Sie für die perfekte Einrichtung benötigen.",
              icon: "design",
              id: "large-selection",
              position: 0,
              title: "Riesige Auswahl",
              url: "/moebel-sortiment",
            },
            {
              description:
                "Unser engagierter Kundenservice steht Ihnen jederzeit zur Verfügung, um sämtliche Fragen zu unserem breiten Moebelsortiment zu beantworten.",
              icon: "advice",
              id: "personal-service",
              position: 1,
              title: "Persönlicher Service",
              url: "mailto:info@jvmoebel.de",
            },
            {
              description:
                "Entscheiden Sie sich für die Zahlungsmethode, die am besten zu Ihren Bedürfnissen passt.",
              icon: "payment",
              id: "flexible-payment",
              position: 2,
              title: "Flexible Zahlung",
              url: "/zahlungsarten",
            },
          ],
          description:
            "Willkommen bei JV Moebel – Ihrem Online-Moebelhaus für höchste Ansprüche! Entdecken Sie eine breite Palette an exklusiven Moebeln, die Ihrem Zuhause Stil und Eleganz verleihen.",
          eyebrow: "Moebel für höchste Ansprüche",
          mark: "JVM",
          tagline: "Preis. Qualität. Zufriedene Kunden.",
          title: "Willkommen bei JV Moebel",
        }),
        createCmsBlock("jv-home-editorial", 3, {
          appearance: "plain",
          introduction: [
            "Unsere Philosophie – Preis, Qualität, zufriedene Kunden – ist die Grundlage unseres Handelns bei <strong>JV Moebel</strong>. Wir sind stolz darauf, hochwertige Moebel zu erschwinglichen Preisen anzubieten und gleichzeitig sicherzustellen, dass unsere Kunden mit ihren Einkäufen vollkommen zufrieden sind. Unser Team widmet sich jeder Einzelheit, angefangen bei der Auswahl der Materialien und dem Design bis hin zur Bereitstellung exzellenten Service und Unterstützung. Unser Ziel ist es, sicherzustellen, dass jeder Kunde mit seinem Einkaufserlebnis rundum zufrieden ist und sich an seinen Moebeln lange erfreut. Mit JV Moebel wird Ihr Einrichtungstraum zur Realität!",
          ],
          sections: [
            {
              id: "one-click-shopping",
              paragraphs: [
                "Entdecken Sie ein bequemes Einkaufserlebnis bei jvmoebel.de – alles mit nur einem Klick in unserem Online-Shop. Tauchen Sie in eine Welt voller neuer Moebel und aktueller Trends ein. Bei uns genießen Sie umfassenden Käuferschutz und Datenschutz, damit Ihr Einkaufserlebnis sorgenfrei ist. Unser engagierter Kundenservice steht Ihnen jederzeit zur Verfügung, um sämtliche Fragen zu unserem breiten Moebelsortiment zu beantworten – von klassischen bis modernen Designs. Ob Sie nach Ledersofas, Schränken, Kindermoebeln, Chesterfield-Moebeln oder robusten Multifunktionsbetten suchen, wir haben alles für Sie im Angebot.",
              ],
              position: 0,
              title: "Einkaufen mit nur einem Klick",
            },
            {
              id: "payment-options",
              paragraphs: [
                "Genießen Sie das Einkaufen bei JV Moebel mit unseren einfachen und flexiblen Zahlungsmöglichkeiten. Bei <strong>JV Moebel</strong> möchten wir Ihnen ein bequemes und sicheres Einkaufserlebnis bieten. Daher bieten wir Ihnen eine Vielzahl flexibler Zahlungsoptionen für Moebel und weitere Artikel an. Entscheiden Sie sich für die Zahlungsmethode, die am besten zu Ihren Bedürfnissen passt:",
                "<strong>Online-Zahlungen:</strong> Bequem und sicher bezahlen Sie Ihre Bestellung per PayPal oder Kreditkarte (Visa, MasterCard) direkt online.<br><strong>Vorkasse:</strong> Sie haben die Möglichkeit, Ihre Bestellung im Voraus zu bezahlen. Sobald die Zahlung eingegangen ist, wird Ihre Bestellung bearbeitet und versandt.<br><strong>Kauf auf Rechnung:</strong> Zahlen Sie erst nach Erhalt Ihrer Moebel bequem auf Rechnung. So können Sie die Produkte erst prüfen, bevor Sie bezahlen. Voraussetzung ist eine positive Bonitätsprüfung.<br><strong>Finanzierung:</strong> Nutzen Sie unsere attraktiven Finanzierungsmöglichkeiten mit flexiblen Laufzeiten und niedrigen Zinssätzen.<br><strong>Ratenzahlung:</strong> Teilen Sie den Betrag Ihrer Bestellung in bequeme monatliche Raten auf.<br><strong>Anzahlung:</strong> Starten Sie Ihren Einkauf bereits mit einer Anzahlung von nur 15 %. Die Restsumme bezahlen Sie kurz vor Erhalt Ihrer Ware.",
                "Bei JV Moebel steht die Sicherheit Ihrer Zahlungstransaktionen stets im Mittelpunkt. Wir legen großen Wert darauf, dass Ihre Daten geschützt sind und Ihre Zahlungen reibungslos abgewickelt werden.",
              ],
              position: 1,
              title: "Flexible Zahlungsmöglichkeiten",
            },
            {
              id: "assembly-service",
              paragraphs: [
                "Bei JV Moebel bieten wir nicht nur niedrige Preise, sondern auch einen erstklassigen Montageservice. Lehnen Sie sich zurück und lassen Sie Ihre Moebel gegen einen geringen Aufpreis von unseren Experten professionell montieren.",
                "Unsere geschulten Monteure kümmern sich um alles, vom Aufbau Ihres neuen Schrankes bis hin zur Installation Ihrer Wohnzimmermoebel. Sie können sich darauf verlassen, dass Ihre Moebel fachgerecht und effizient montiert werden, sodass Sie Ihr Zuhause schnell und unkompliziert genießen können.",
              ],
              position: 2,
              title: "Professioneller Montageservice",
            },
            {
              id: "discounts",
              paragraphs: [
                "Entdecken Sie niedrige Preise für robuste Moebel bei JV Moebel. Mit unseren Rabattaktionen von bis zu 30 % können Sie stilvolle Einrichtungsgegenstände für jedes Budget finden. Wählen Sie Chesterfield Moebel, Stoff- und Ledersofas ganz nach Ihrem Geschmack und profitieren Sie von hochwertigen Produkten zu bezahlbaren Preisen. JV Moebel beweist, dass Qualität und erschwingliche Preise Hand in Hand gehen. Verwirklichen Sie Ihren Wohntraum mit Markenmoebeln zum kleinen Preis – JV Moebel, das große Moebelhaus für Ihr Zuhause!",
              ],
              position: 3,
              title: "Bis zu 30 % sparen",
            },
            {
              id: "free-delivery",
              paragraphs: [
                "Bei jvmoebel.de erhalten Sie nicht nur Moebel von herausragender Qualität, sondern auch eine kostenfreie Lieferung. Viele unserer Moebel sind sofort versandfertig oder werden innerhalb weniger Tage geliefert. Unsere verlässlichen Logistikpartner bringen bestellte Moebel wie Chesterfield Sofas, Ledersofas, Stoffsofas, Betten, Stühle, Sessel und Tische direkt an die von Ihnen angegebene Adresse. Erleben Sie die unkomplizierte und kostenlose Zustellung Ihrer Wunschmoebel bei jvmoebel.de.",
              ],
              position: 4,
              title: "Gratis Versand",
            },
            {
              id: "selection",
              paragraphs: [
                "Mit einer beeindruckenden Auswahl von über 70.000 Moebelstücken bieten wir Ihnen alles, was Sie für die perfekte Einrichtung benötigen. Von zeitgenössischen Designs bis hin zu klassischer Eleganz, von luxuriösen Chesterfield Sofas bis hin zu funktionalen Stauraumlösungen – unsere Vielfalt an Stilen und Produkten lässt keine Wünsche offen. Tauchen Sie ein in unsere Welt der Moebel und lassen Sie sich von unserer riesigen Auswahl inspirieren!",
              ],
              position: 5,
              title: "Riesige Auswahl",
            },
            {
              id: "newsletter",
              paragraphs: [
                "Bleiben Sie stets über die neuesten Trends und Angebote informiert, indem Sie sich für unseren Newsletter anmelden! Erhalten Sie exklusive Einblicke, besondere Angebote und inspirierende Einrichtungstipps direkt in Ihr Postfach. Seien Sie Teil unserer Moebel-Community und verpassen Sie keine Neuigkeiten mehr – melden Sie sich noch heute an!",
              ],
              position: 6,
              title: "Newsletter – immer im Trend bleiben",
            },
            {
              id: "customer-feedback",
              paragraphs: [
                "Die Meinung unserer Kunden liegt uns sehr am Herzen, denn sie ist ein wichtiger Bestandteil unseres Engagements für Exzellenz bei JV Moebel. Jedes Kundenfeedback hilft uns dabei, unsere Produkte und unseren Service kontinuierlich zu verbessern. Wir schätzen die Ehrlichkeit und das Vertrauen unserer Kunden und streben danach, ihre Erwartungen stets zu übertreffen. Ihre Zufriedenheit ist unser oberstes Ziel, und wir sind stets bestrebt, Ihr Feedback anzuhören und darauf zu reagieren. Gemeinsam können wir eine noch bessere Einkaufserfahrung schaffen und Ihre Moebelträume wahr werden lassen.",
              ],
              position: 7,
              title: "Kunden-Feedback",
            },
          ],
          showLessLabel: "Weniger anzeigen",
          showMoreLabel: "Mehr über Service und Einkauf",
          statement: "Was uns antreibt",
          title: "Preis, Qualität, zufriedene Kunden.",
        }),
      ],
      id: "mock-about-section",
      position: 0,
      sizingMode: "full_width",
      type: "default",
    },
  ],
  type: "landingpage",
} satisfies CmsPage;
