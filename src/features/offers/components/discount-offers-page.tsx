import {
  ArrowRight,
  BadgeEuro,
  ChevronDown,
  RefreshCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ShopProductCard } from "@/features/catalog/components/shop-product-card";
import type { ShopProductListing } from "@/features/catalog/model/product-listing";
import { SaleProductsButton } from "@/features/offers/components/sale-products-button";

const categoryOffers = [
  {
    image: "/images/main/hero-editorial.webp",
    label: "Garten & Freizeit",
  },
  { image: "/images/main/dining-room.webp", label: "Tische" },
  { image: "/images/main/hero-living.webp", label: "Sofas & Couches" },
  { image: "/images/main/bedroom.webp", label: "Betten" },
  { image: "/images/main/lounge-chair.webp", label: "Stühle" },
  { image: "/images/main/media-console.webp", label: "Schränke" },
  { image: "/images/main/bedroom.webp", label: "Lampen" },
  { image: "/images/main/media-console.webp", label: "Regale" },
  { image: "/images/main/lounge-chair.webp", label: "Sessel" },
  { image: "/images/main/media-console.webp", label: "Sideboards" },
  { image: "/images/main/dining-room.webp", label: "Kommoden" },
  { image: "/images/main/media-console.webp", label: "TV-Möbel" },
  { image: "/images/main/bedroom.webp", label: "Badmöbel" },
  { image: "/images/main/hero-editorial.webp", label: "Teppiche" },
  { image: "/images/main/bedroom.webp", label: "Textilien" },
  { image: "/images/main/dining-room.webp", label: "Accessoires" },
] as const;

const benefits = [
  {
    description: "Ausgewählte Möbel mit transparentem Preisvorteil.",
    icon: BadgeEuro,
    title: "Hohe Qualität zu fairen Preisen",
  },
  {
    description: "In Ruhe entscheiden und unkompliziert zurücksenden.",
    icon: RefreshCcw,
    title: "30 Tage Rückgaberecht",
  },
  {
    description: "Große Möbel liefern wir bequem bis zum Wunschort.",
    icon: Truck,
    title: "Möbelspedition und Aufbauservice",
  },
] as const;

const frequentlyAskedQuestions = [
  {
    answer:
      "Lege die gewünschten Produkte in den Warenkorb. Wenn für die Bestellung ein Aktionscode verfügbar ist, kannst du ihn im dafür vorgesehenen Feld eingeben. Der gültige Nachlass wird anschließend direkt in der Bestellübersicht angezeigt.",
    question: "Wie kann ich einen JVMöbel Rabattcode einlösen?",
  },
  {
    answer:
      "Aktionscodes gelten normalerweise einmal pro Person und Bestellung. Die genauen Bedingungen findest du immer direkt bei der jeweiligen Aktion.",
    question: "Kann ich einen Rabattcode mehrmals verwenden?",
  },
  {
    answer:
      "Einige Aktionen haben einen Mindestbestellwert. Ob und in welcher Höhe er gilt, steht in den Aktionsbedingungen des jeweiligen Angebots.",
    question: "Gibt es einen Mindestbestellwert?",
  },
  {
    answer:
      "Die Gültigkeit steht beim jeweiligen Code oder Angebot. Zeitlich begrenzte Aktionen werden nach Ablauf nicht mehr im Warenkorb berücksichtigt.",
    question: "Wie lange ist ein Rabattcode gültig?",
  },
  {
    answer:
      "Das hängt von der Aktion ab. Falls ein Code auch für bereits reduzierte Produkte gilt, wird dies ausdrücklich in den Bedingungen genannt.",
    question: "Kann ich Rabattcodes für reduzierte Artikel nutzen?",
  },
  {
    answer:
      "Prüfe Schreibweise, Gültigkeitszeitraum, Mindestbestellwert und die teilnehmenden Produkte. Wenn alles stimmt und der Code weiterhin abgelehnt wird, hilft dir unser Kundenservice weiter.",
    question: "Was kann ich tun, wenn mein Rabattcode nicht funktioniert?",
  },
  {
    answer:
      "Ja. Auf dieser Seite bündeln wir dauerhaft reduzierte Möbel und wechselnde Aktionen. Das Sortiment kann sich ändern, sobald Artikel ausverkauft sind.",
    question: "Gibt es bei JVMöbel einen dauerhaften Sale?",
  },
] as const;

type DiscountOffersPageProps = Readonly<{
  listing: ShopProductListing;
}>;

export function DiscountOffersPage({ listing }: DiscountOffersPageProps) {
  const discountedProducts = listing.products.filter(
    (product) =>
      product.previousPrice && product.previousPrice > product.unitPrice,
  );

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-360 px-4 pb-20 sm:px-8 sm:pb-28">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2.5 pt-6 text-xs text-muted-foreground"
        >
          <Link className="transition-colors hover:text-primary" href="/">
            Startseite
          </Link>
          <span aria-hidden="true">/</span>
          <strong className="font-medium text-foreground">Angebote</strong>
        </nav>

        <header className="pt-9 pb-8 sm:pt-12 sm:pb-10">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase before:block before:size-1.5 before:rounded-full before:bg-primary">
            Preisvorteile für dein Zuhause
          </p>
          <div className="flex flex-col gap-5 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-4xl leading-none font-semibold tracking-[-0.05em] text-balance sm:text-5xl">
              Sale im Überblick
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-right">
              Entdecke reduzierte Möbel, Wohnaccessoires und ausgewählte
              Bestseller zum Vorteilspreis.
            </p>
          </div>
        </header>

        <section
          aria-label="JVMöbel Sale"
          className="overflow-hidden rounded-3xl bg-foreground text-background shadow-[0_28px_70px_-42px_rgba(21,21,19,0.8)]"
        >
          <div className="relative">
            <Image
              alt="Helles Wohnzimmer mit modularer Couch, Loungesessel und Couchtisch"
              className="h-auto w-full"
              height={887}
              priority
              sizes="(max-width: 1536px) 100vw, 1440px"
              src="/images/offers/sale-living-room.webp"
              width={1774}
            />
            <div className="absolute inset-0 hidden bg-linear-to-r from-foreground/90 via-foreground/45 to-transparent sm:block" />
            <div className="absolute inset-y-0 left-0 hidden w-[48%] flex-col justify-center p-8 sm:flex lg:p-12 xl:p-16">
              <span className="w-fit rounded-full bg-primary px-3 py-1.5 text-xs font-bold tracking-[0.12em] text-primary-foreground uppercase">
                JVMöbel Sale
              </span>
              <h2 className="mt-5 max-w-xl text-3xl leading-[1.05] font-semibold tracking-[-0.05em] text-balance lg:text-5xl">
                Bis zu 35 % auf ausgewählte Möbel
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-background/80 lg:text-base lg:leading-7">
                Entdecke Sofas, Sessel, Tische und Stauraummöbel mit direktem
                Preisvorteil.
              </p>
              <SaleProductsButton className="mt-6 w-fit" />
            </div>
          </div>
          <div className="p-6 sm:hidden">
            <span className="w-fit rounded-full bg-primary px-3 py-1.5 text-xs font-bold tracking-[0.12em] text-primary-foreground uppercase">
              JVMöbel Sale
            </span>
            <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-[-0.04em]">
              Bis zu 35 % auf ausgewählte Möbel
            </h2>
            <p className="mt-3 text-sm leading-6 text-background/75">
              Entdecke Sofas, Sessel, Tische und Stauraummöbel mit direktem
              Preisvorteil.
            </p>
            <SaleProductsButton className="mt-5 w-full" />
          </div>
        </section>

        <section
          aria-labelledby="offer-categories-title"
          className="pt-16 sm:pt-20"
        >
          <div className="mb-6 flex items-end justify-between gap-5">
            <h2
              className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl"
              id="offer-categories-title"
            >
              Alle Angebote nach Kategorien
            </h2>
            <Link
              className="hidden text-sm font-semibold underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-primary sm:block"
              href="/shop"
            >
              Alle Deals entdecken
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
            {categoryOffers.map((category) => (
              <Link
                className="group min-w-0 rounded-2xl border bg-card p-2 shadow-[0_10px_30px_-26px_rgba(21,21,19,0.6)] transition-[transform,border-color,box-shadow] hover:border-foreground/25 hover:shadow-[0_18px_36px_-25px_rgba(21,21,19,0.65)] motion-safe:hover:-translate-y-1"
                href="/shop"
                key={category.label}
              >
                <span className="relative block aspect-square overflow-hidden rounded-xl bg-muted/60">
                  <span className="absolute inset-2">
                    <Image
                      alt=""
                      className="object-contain transition-transform duration-500 motion-safe:group-hover:scale-105"
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 12.5vw"
                      src={category.image}
                    />
                  </span>
                </span>
                <span className="flex min-h-12 items-center justify-center px-1 py-2 text-center text-sm leading-5 font-semibold">
                  {category.label}
                </span>
              </Link>
            ))}
          </div>

          <Button
            className="mt-5 w-full sm:hidden"
            render={<Link href="/shop" />}
            variant="outline"
          >
            Alle Deals entdecken
          </Button>
        </section>

        <section
          aria-labelledby="popular-sale-title"
          className="py-16 sm:py-20"
          id="sale-products"
        >
          <div className="mb-8 overflow-hidden rounded-3xl bg-foreground px-6 py-8 text-background sm:flex sm:items-end sm:justify-between sm:gap-8 sm:px-10 sm:py-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                Nur solange der Vorrat reicht
              </p>
              <h2
                className="mt-3 max-w-2xl text-3xl leading-tight font-semibold tracking-[-0.04em] text-balance sm:text-4xl"
                id="popular-sale-title"
              >
                Unsere beliebtesten Produkte im Sale
              </h2>
            </div>
            <Button
              className="mt-6 shrink-0 sm:mt-0"
              render={<Link href="/shop" />}
              size="lg"
            >
              Jetzt entdecken
            </Button>
          </div>

          <div className="grid grid-flow-col auto-cols-[minmax(15rem,18rem)] gap-3 overflow-x-auto pb-4 sm:gap-4">
            {discountedProducts.map((product, index) => (
              <ShopProductCard
                currency={listing.currency}
                eagerImage={index < 4}
                key={product.id}
                locale={listing.locale}
                product={product}
              />
            ))}
          </div>
        </section>

        <section
          aria-label="JVMöbel Einrichtungsberatung"
          className="mt-16 overflow-hidden rounded-3xl border bg-card shadow-[0_24px_60px_-42px_rgba(21,21,19,0.7)] sm:mt-20"
        >
          <div className="relative">
            <Image
              alt="Einrichtungstisch mit Stoff-, Holz- und Materialmustern"
              className="h-auto w-full"
              height={724}
              sizes="(max-width: 1536px) 100vw, 1440px"
              src="/images/offers/design-consultation.webp"
              width={2172}
            />
            <div className="absolute inset-y-0 right-0 hidden w-[43%] flex-col justify-center p-8 sm:flex lg:p-12">
              <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                Persönlich geplant
              </p>
              <h2 className="mt-3 text-2xl leading-tight font-semibold tracking-[-0.04em] text-balance lg:text-4xl">
                Unsicher bei Material oder Maß?
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground lg:text-base lg:leading-7">
                Wir helfen dir, das passende Möbel und die richtige Ausführung
                für deinen Raum auszuwählen.
              </p>
              <Button
                className="mt-5 w-fit"
                render={
                  <a href="mailto:info@jvmoebel.de?subject=Einrichtungsberatung" />
                }
                variant="outline"
              >
                Beratung anfragen
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
          <div className="p-6 sm:hidden">
            <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
              Persönlich geplant
            </p>
            <h2 className="mt-3 text-2xl leading-tight font-semibold tracking-[-0.04em]">
              Unsicher bei Material oder Maß?
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Wir helfen dir, das passende Möbel und die richtige Ausführung für
              deinen Raum auszuwählen.
            </p>
            <Button
              className="mt-5 w-full"
              render={
                <a href="mailto:info@jvmoebel.de?subject=Einrichtungsberatung" />
              }
              variant="outline"
            >
              Beratung anfragen
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </section>

        <section
          aria-label="Vorteile bei JVMöbel"
          className="grid overflow-hidden rounded-3xl border bg-card md:grid-cols-3"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                className="flex gap-4 border-b p-6 last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0 sm:p-8"
                key={benefit.title}
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        <section
          aria-labelledby="discount-faq-title"
          className="py-16 sm:py-20"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(16rem,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                Gut zu wissen
              </p>
              <h2
                className="mt-3 text-3xl leading-tight font-semibold tracking-[-0.04em] text-balance"
                id="discount-faq-title"
              >
                Häufige Fragen zu Rabattcodes
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
                Hier findest du die wichtigsten Informationen zu Aktionen, Codes
                und reduzierten Artikeln.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-card">
              {frequentlyAskedQuestions.map((item) => (
                <details
                  className="group border-b last:border-b-0"
                  key={item.question}
                >
                  <summary className="flex min-h-18 cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-base font-semibold [&::-webkit-details-marker]:hidden sm:px-6">
                    {item.question}
                    <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="border-t bg-muted/20 px-5 py-5 text-sm leading-7 text-muted-foreground sm:px-6">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <article className="rounded-3xl border bg-muted/30 px-5 py-10 sm:px-10 sm:py-14 lg:px-16">
          <div className="mx-auto max-w-4xl space-y-12 text-base leading-8 text-muted-foreground">
            <section>
              <h2 className="text-3xl leading-tight font-semibold tracking-[-0.04em] text-foreground">
                Möbel im Sale bequem online bestellen
              </h2>
              <p className="mt-5">
                Bei JVMöbel findest du das ganze Jahr über ausgewählte Möbel und
                Wohnaccessoires zu reduzierten Preisen. Vom Sofa über den
                Esstisch bis zum Stauraummöbel zeigen wir den aktuellen Preis
                und den vorherigen Vergleichspreis direkt am Produkt. So siehst
                du den Vorteil auf einen Blick und kannst dein Zuhause passend
                zu deinem Budget einrichten.
              </p>
              <p className="mt-4">
                Unser Online-Sortiment lässt sich jederzeit in Ruhe entdecken.
                Miss den verfügbaren Platz aus, vergleiche Materialien und
                Größen und wähle anschließend die passende Ausführung für dein
                Zuhause.
              </p>
            </section>

            <section>
              <h2 className="text-2xl leading-tight font-semibold tracking-[-0.03em] text-foreground">
                So kannst du bei JVMöbel sparen
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border bg-background p-5">
                  <h3 className="font-semibold text-foreground">Newsletter</h3>
                  <p className="mt-2 text-sm leading-7">
                    Erfahre frühzeitig von neuen Aktionen, Sortimentsergänzungen
                    und zeitlich begrenzten Preisvorteilen.
                  </p>
                </div>
                <div className="rounded-2xl border bg-background p-5">
                  <h3 className="font-semibold text-foreground">Sale</h3>
                  <p className="mt-2 text-sm leading-7">
                    Reduzierte Produkte sind bereits mit dem gültigen
                    Vorteilspreis ausgezeichnet und häufig nur begrenzt
                    verfügbar.
                  </p>
                </div>
                <div className="rounded-2xl border bg-background p-5">
                  <h3 className="font-semibold text-foreground">
                    Rabattaktionen
                  </h3>
                  <p className="mt-2 text-sm leading-7">
                    Aktionscodes können für ausgewählte Produkte, Kategorien
                    oder ab einem bestimmten Bestellwert gelten.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl leading-tight font-semibold tracking-[-0.03em] text-foreground">
                Reduzierte Möbel für jeden Raum
              </h2>
              <p className="mt-4">
                Ob Wohnzimmer, Esszimmer, Schlafzimmer oder Arbeitsbereich: Im
                Sale findest du Möbel für unterschiedliche Räume und
                Einrichtungsstile. Besonders gefragt sind Sofas und Sessel,
                Esstische und Stühle, Betten, Schränke, Sideboards sowie
                praktische Aufbewahrungslösungen.
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "Sofas, Sessel und weitere Sitzmöbel",
                  "Ess-, Couch- und Beistelltische",
                  "Betten und Möbel für das Schlafzimmer",
                  "Schränke, Regale und Sideboards",
                  "Leuchten, Teppiche und Textilien",
                  "Accessoires für ein stimmiges Zuhause",
                ].map((item) => (
                  <li className="flex items-start gap-3" key={item}>
                    <ShieldCheck className="mt-1 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl leading-tight font-semibold tracking-[-0.03em] text-foreground">
                Schneller das passende Angebot finden
              </h2>
              <p className="mt-4">
                Nutze im Shop die Filter für Kategorie, Material, Farbe, Größe,
                Marke und Preis. Damit grenzt du die Auswahl gezielt ein und
                vergleichst nur Möbel, die wirklich zu deinen Anforderungen
                passen. Produktbilder werden vollständig dargestellt, damit du
                Form und Proportionen zuverlässig beurteilen kannst.
              </p>
            </section>

            <section>
              <h2 className="text-2xl leading-tight font-semibold tracking-[-0.03em] text-foreground">
                Preisvorteil ohne Kompromisse beim Design
              </h2>
              <p className="mt-4">
                Ein reduzierter Preis bedeutet nicht, dass du dich auf einen
                bestimmten Stil festlegen musst. Das Angebot reicht von klaren,
                modernen Formen über warme Naturmaterialien bis zu markanten
                Polstermöbeln. Auf der Produktseite findest du Maße,
                Materialien, verfügbare Varianten und Lieferinformationen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl leading-tight font-semibold tracking-[-0.03em] text-foreground">
                Günstig bestellen und komfortabel liefern lassen
              </h2>
              <p className="mt-4">
                Große Möbel werden per Spedition geliefert. Bei teilnehmenden
                Produkten kannst du zusätzliche Services auswählen und deine
                Anfrage direkt von der Produktseite an unser Beratungsteam
                senden. So bleiben Preis, Ausführung und Lieferwunsch in einer
                übersichtlichen Anfrage zusammengefasst.
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
