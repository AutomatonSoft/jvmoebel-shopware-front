import {
  CalendarDays,
  ChevronRight,
  FileText,
  Info,
  ListChecks,
  Megaphone,
  Ruler,
  ShieldCheck,
  Star,
  SwatchBook,
  Undo2,
  Video,
} from "lucide-react";

import type { ShopProductDetail } from "@/features/catalog/model/product-detail";

type ProductSpecificationsProps = Readonly<{
  product: ShopProductDetail;
}>;

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const dimensions = product.dimensions;
  const rating = product.rating;
  const filledStars = Math.round(rating ?? 0);
  const adviceSubject = encodeURIComponent(
    `Produktberatung: ${product.name} (${product.articleNumber})`,
  );
  const sampleSubject = encodeURIComponent(
    `Stoffmuster bestellen: ${product.name} (${product.articleNumber})`,
  );

  return (
    <section className="space-y-4 py-12 sm:py-16" id="product-details">
      <header className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          Produktdetails
        </p>
        <h2 className="mt-3 text-3xl leading-tight font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
          Alles Wichtige auf einen Blick.
        </h2>
      </header>

      <div className="overflow-hidden rounded-2xl border bg-card">
        {dimensions.length > 0 && (
          <section
            aria-labelledby="product-dimensions-title"
            className="border-b p-5 sm:p-7"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
                <Ruler aria-hidden="true" className="size-5" />
              </span>
              <h3
                className="text-lg font-semibold"
                id="product-dimensions-title"
              >
                Produktabmessungen
              </h3>
            </div>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {dimensions.map((dimension) => (
                <div
                  className="rounded-xl border bg-muted/25 p-4"
                  key={dimension.id}
                >
                  <dt className="text-xs text-muted-foreground">
                    {dimension.label}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {dimension.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section
          aria-labelledby="product-facts-title"
          className="border-b p-5 sm:p-7"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
              <ListChecks aria-hidden="true" className="size-5" />
            </span>
            <h3 className="text-lg font-semibold" id="product-facts-title">
              Produktinformationen
            </h3>
          </div>
          <dl className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {product.specifications.map((specification) => (
              <div
                className="border-t py-3 first:border-t-0 sm:[&:nth-child(2)]:border-t-0 lg:[&:nth-child(3)]:border-t-0 lg:[&:nth-child(4)]:border-t-0"
                key={specification.id}
              >
                <dt className="text-xs text-muted-foreground">
                  {specification.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold wrap-break-word">
                  {specification.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {product.longDescriptionHtml && (
          <section
            aria-labelledby="product-description-title"
            className="border-b"
          >
            <div className="flex items-center gap-3 border-b bg-muted/20 px-5 py-5 sm:px-7">
              <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
                <FileText aria-hidden="true" className="size-5" />
              </span>
              <h3
                className="text-lg font-semibold"
                id="product-description-title"
              >
                Beschreibung
              </h3>
            </div>
            <div
              className="px-5 py-6 text-sm leading-7 text-muted-foreground sm:px-7 [&_blockquote]:my-5 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_h2]:mt-7 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h4]:mt-5 [&_h4]:mb-2 [&_h4]:font-semibold [&_h4]:text-foreground [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{
                __html: product.longDescriptionHtml,
              }}
            />
          </section>
        )}

        <section
          aria-labelledby="product-brand-title"
          className="bg-muted/15 p-5 sm:flex sm:items-start sm:justify-between sm:gap-10 sm:p-7"
        >
          <div className="shrink-0">
            <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
              Marke
            </p>
            <h3 className="mt-3 text-xl font-semibold" id="product-brand-title">
              {product.company}
            </h3>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-0">
            Weitere Informationen zur Marke und zu diesem Produkt erhalten Sie
            in unserer persönlichen Beratung.
          </p>
        </section>
      </div>

      {rating !== undefined && (
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
          {product.reviewCount !== undefined && (
            <p className="mt-3 text-sm text-muted-foreground">
              von {product.reviewCount} Kund:innen
            </p>
          )}
        </section>
      )}

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
