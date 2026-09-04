import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Info,
  Megaphone,
  ShieldCheck,
  Star,
  SwatchBook,
  Undo2,
  Video,
} from "lucide-react";
import type { ReactNode } from "react";

import type { ShopProductDetail } from "@/features/catalog/model/product-detail";

type ProductSpecificationsProps = Readonly<{
  product: ShopProductDetail;
}>;

type ProductDetailSection = Readonly<{
  content: ReactNode;
  title: string;
}>;

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const dimensions = [
    { label: "Breite", value: product.dimensions.width },
    { label: "Höhe", value: product.dimensions.height },
    { label: "Tiefe", value: product.dimensions.length },
  ];
  const sections: readonly ProductDetailSection[] = [
    {
      content: (
        <dl className="grid gap-3 sm:grid-cols-3">
          {dimensions.map((dimension) => (
            <div
              className="rounded-xl border bg-background p-4"
              key={dimension.label}
            >
              <dt className="text-xs text-muted-foreground">
                {dimension.label}
              </dt>
              <dd className="mt-1 text-lg font-semibold">
                {dimension.value} {product.dimensions.unit}
              </dd>
            </div>
          ))}
        </dl>
      ),
      title: "Produktabmessungen",
    },
    {
      content: (
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {product.specifications.map((specification) => (
            <div className="border-b pb-3" key={specification.id}>
              <dt className="text-xs text-muted-foreground">
                {specification.label}
              </dt>
              <dd className="mt-1 text-sm font-semibold">
                {specification.value}
              </dd>
            </div>
          ))}
        </dl>
      ),
      title: "Produktdetails",
    },
    {
      content: (
        <ul className="grid gap-3 text-sm leading-6 sm:grid-cols-2">
          <li className="rounded-xl border bg-background p-4">
            Ausführung in {product.material}
          </li>
          <li className="rounded-xl border bg-background p-4">
            {product.colors.length} Farbvarianten verfügbar
          </li>
          <li className="rounded-xl border bg-background p-4">
            {product.sizes.length} Größen zur Auswahl
          </li>
          <li className="rounded-xl border bg-background p-4">
            Lieferung per Möbelspedition
          </li>
        </ul>
      ),
      title: "Funktion & Qualität",
    },
    {
      content: (
        <p className="max-w-4xl text-sm leading-7 text-muted-foreground">
          {product.longDescription}
        </p>
      ),
      title: "Beschreibung",
    },
    {
      content: (
        <div className="max-w-4xl">
          <h3 className="font-semibold">{product.company}</h3>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Weitere Informationen zur Marke und zu diesem Produkt erhalten Sie
            in unserer persönlichen Beratung.
          </p>
        </div>
      ),
      title: "Über die Marke",
    },
  ];
  const rating = product.rating ?? 0;
  const filledStars = Math.round(rating);
  const adviceSubject = encodeURIComponent(
    `Produktberatung: ${product.name} (${product.articleNumber})`,
  );
  const sampleSubject = encodeURIComponent(
    `Stoffmuster bestellen: ${product.name} (${product.articleNumber})`,
  );

  return (
    <section className="space-y-3 py-12 sm:py-16" id="product-details">
      <div className="overflow-hidden rounded-2xl border bg-card">
        {sections.map((section) => (
          <details
            className="group border-b last:border-b-0"
            key={section.title}
          >
            <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden sm:px-7">
              {section.title}
              <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t bg-muted/20 px-5 py-6 sm:px-7">
              {section.content}
            </div>
          </details>
        ))}
      </div>

      <section
        aria-labelledby="product-ratings-title"
        className="rounded-2xl border bg-card px-5 py-7 sm:px-7"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold" id="product-ratings-title">
            Bewertungen
          </h2>
          <Info className="size-5 text-muted-foreground" />
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
          <p className="text-4xl font-semibold tracking-tight">
            {rating.toFixed(1).replace(".", ",")}
            <span className="ml-1 text-base font-normal text-muted-foreground">
              / 5
            </span>
          </p>
          <div
            aria-label={`${rating.toFixed(1)} von 5 Sternen`}
            className="flex gap-1"
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                aria-hidden="true"
                className={`size-5 text-primary ${index < filledStars ? "fill-primary" : "fill-transparent"}`}
                key={index}
              />
            ))}
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          von {product.reviewCount ?? 0} Kund:innen
        </p>
      </section>

      <section
        aria-labelledby="product-advice-title"
        className="rounded-2xl border bg-card px-5 py-7 sm:px-7"
      >
        <h2 className="text-xl font-semibold" id="product-advice-title">
          Immer noch nicht sicher?
        </h2>
        <div className="mt-6 grid gap-2">
          <a
            className="group flex min-h-20 items-center gap-4 rounded-xl border px-5 py-4 transition-colors hover:border-foreground/45 hover:bg-muted/30"
            href={`mailto:info@jvmoebel.de?subject=${adviceSubject}`}
          >
            <Video className="size-7 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1">
              <strong className="block font-semibold">Produktberatung</strong>
              <span className="mt-0.5 block text-sm">im Videochat buchen</span>
            </span>
            <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </a>
          <a
            className="group flex min-h-20 items-center gap-4 rounded-xl border px-5 py-4 transition-colors hover:border-foreground/45 hover:bg-muted/30"
            href={`mailto:info@jvmoebel.de?subject=${sampleSubject}`}
          >
            <SwatchBook className="size-7 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1">
              <strong className="block font-semibold">Stoffmuster</strong>
              <span className="mt-0.5 block text-sm">kostenlos bestellen</span>
            </span>
            <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>

      <section
        aria-label="Rückgabe und rechtliche Informationen"
        className="rounded-2xl border bg-card px-5 py-7 sm:px-7"
      >
        <div className="space-y-4 text-sm sm:text-base">
          <p className="flex items-center gap-3">
            <CalendarDays className="size-5 shrink-0 text-muted-foreground" />
            30 Tage Rückgaberecht
          </p>
          <p className="flex items-center gap-3">
            <Undo2 className="size-5 shrink-0 text-muted-foreground" />
            Kostenlose Retoure
          </p>
        </div>
        <div className="mt-6 space-y-4 border-t pt-6 text-sm sm:text-base">
          <a
            className="flex w-fit items-center gap-3 underline decoration-foreground/35 underline-offset-4 hover:text-primary"
            href="#product-details"
          >
            <ShieldCheck className="size-5 shrink-0 text-muted-foreground" />
            Produkt- und Sicherheitsinformationen
          </a>
          <a
            className="flex w-fit items-center gap-3 underline decoration-foreground/35 underline-offset-4 hover:text-primary"
            href="mailto:info@jvmoebel.de?subject=Rechtliche%20Bedenken%20melden"
          >
            <Megaphone className="size-5 shrink-0 text-muted-foreground" />
            Rechtliche Bedenken melden
          </a>
        </div>
      </section>
    </section>
  );
}
