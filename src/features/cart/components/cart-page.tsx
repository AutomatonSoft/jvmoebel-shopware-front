import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ShopCart, ShopCartItem } from "@/features/cart/model/cart";
import {
  applyPromotionCode,
  removeCartItem,
  updateCartItem,
} from "@/features/cart/server/actions";

type CartPageProps = Readonly<{
  cart: ShopCart;
  error?: string;
}>;

function QuantityControl({ item }: Readonly<{ item: ShopCartItem }>) {
  if (!item.stackable) {
    return (
      <span className="text-xs font-medium text-muted-foreground">
        Menge {item.quantity}
      </span>
    );
  }

  return (
    <div
      aria-label={`Menge für ${item.label}`}
      className="inline-flex h-10 items-center rounded-full border bg-background p-1"
    >
      <form action={updateCartItem}>
        <input name="id" type="hidden" value={item.id} />
        <input
          name="quantity"
          type="hidden"
          value={Math.max(item.minQuantity, item.quantity - item.quantityStep)}
        />
        <button
          aria-label="Menge verringern"
          className="grid size-8 place-items-center rounded-full hover:bg-muted disabled:cursor-not-allowed disabled:opacity-35"
          disabled={item.quantity <= item.minQuantity}
          type="submit"
        >
          <Minus className="size-3.5" />
        </button>
      </form>
      <output className="min-w-8 text-center text-sm font-semibold">
        {item.quantity}
      </output>
      <form action={updateCartItem}>
        <input name="id" type="hidden" value={item.id} />
        <input
          name="quantity"
          type="hidden"
          value={Math.min(item.maxQuantity, item.quantity + item.quantityStep)}
        />
        <button
          aria-label="Menge erhöhen"
          className="grid size-8 place-items-center rounded-full hover:bg-muted disabled:cursor-not-allowed disabled:opacity-35"
          disabled={item.quantity >= item.maxQuantity}
          type="submit"
        >
          <Plus className="size-3.5" />
        </button>
      </form>
    </div>
  );
}

function CartItemRow({
  currency,
  editable,
  item,
  locale,
}: Readonly<{
  currency: string;
  editable: boolean;
  item: ShopCartItem;
  locale: string;
}>) {
  const formatter = new Intl.NumberFormat(locale, {
    currency,
    minimumFractionDigits: 2,
    style: "currency",
  });
  const content = item.image ? (
    <Image
      alt={item.image.alt}
      className="object-contain"
      fill
      sizes="(max-width: 640px) 112px, 160px"
      src={item.image.url}
      unoptimized={item.image.url.startsWith("http")}
    />
  ) : (
    <ShoppingBag className="size-8 text-muted-foreground" />
  );

  return (
    <article className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 py-6 first:pt-0 last:pb-0 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:gap-6">
      {item.url ? (
        <a
          aria-label={item.label}
          className="relative grid aspect-square place-items-center overflow-hidden rounded-2xl bg-muted/65 p-3"
          href={item.url}
        >
          {content}
        </a>
      ) : (
        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-2xl bg-muted/65 p-3">
          {content}
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        <p className="text-[0.625rem] font-semibold tracking-[0.13em] text-primary uppercase">
          Im Warenkorb
        </p>
        <h2 className="mt-1 text-base leading-6 font-semibold tracking-[-0.02em] sm:text-lg">
          {item.url ? <a href={item.url}>{item.label}</a> : item.label}
        </h2>
        {item.deliveryLabel && (
          <p className="mt-2 flex items-center gap-2 text-xs leading-5 text-muted-foreground sm:text-sm">
            <Truck className="size-4 shrink-0 text-foreground" />
            {item.deliveryLabel}
          </p>
        )}
        <div className="mt-auto hidden items-end gap-3 pt-4 sm:flex">
          {editable ? (
            <QuantityControl item={item} />
          ) : (
            <span className="text-xs font-medium text-muted-foreground">
              Menge {item.quantity}
            </span>
          )}
          {editable && item.removable && (
            <form action={removeCartItem}>
              <input name="id" type="hidden" value={item.id} />
              <button
                className="flex h-10 items-center gap-2 rounded-full px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                type="submit"
              >
                <Trash2 className="size-3.5" />
                Entfernen
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="col-span-2 flex items-end justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end">
        <div className="text-right">
          <strong className="block text-lg tracking-[-0.03em]">
            {formatter.format(item.totalPrice)}
          </strong>
          {item.quantity > 1 && (
            <span className="text-xs text-muted-foreground">
              {formatter.format(item.unitPrice)} je Stück
            </span>
          )}
          {item.previousUnitPrice && (
            <del className="mt-1 block text-xs text-muted-foreground">
              {formatter.format(item.previousUnitPrice)}
            </del>
          )}
        </div>
        <div className="sm:hidden">
          <div className="flex items-center gap-1">
            {editable ? (
              <QuantityControl item={item} />
            ) : (
              <span className="text-xs font-medium text-muted-foreground">
                Menge {item.quantity}
              </span>
            )}
            {editable && item.removable && (
              <form action={removeCartItem}>
                <input name="id" type="hidden" value={item.id} />
                <button
                  aria-label={`${item.label} entfernen`}
                  className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                  type="submit"
                >
                  <Trash2 className="size-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyCart() {
  return (
    <section className="rounded-3xl border bg-card px-6 py-16 text-center shadow-[0_22px_70px_-55px_rgba(21,21,19,0.7)] sm:px-10 sm:py-24">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-muted">
        <ShoppingBag className="size-7" />
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Ihr Warenkorb ist leer
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        Entdecken Sie Möbel, die zu Ihrem Zuhause passen, und stellen Sie Ihre
        persönliche Auswahl zusammen.
      </p>
      <Button
        className="mt-7"
        nativeButton={false}
        render={<Link href="/moebel-sortiment" />}
        size="lg"
      >
        Sortiment entdecken
        <ArrowRight />
      </Button>
    </section>
  );
}

export function CartPage({ cart, error }: CartPageProps) {
  const formatter = new Intl.NumberFormat(cart.locale, {
    currency: cart.currency,
    minimumFractionDigits: 2,
    style: "currency",
  });
  const itemCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const inquiryItems = cart.items
    .map((item) => `${item.quantity}× ${item.label}`)
    .join(", ");
  const inquiryHref = `mailto:info@jvmoebel.de?subject=${encodeURIComponent("Bestellanfrage aus dem Warenkorb")}&body=${encodeURIComponent(`Guten Tag, ich interessiere mich für folgende Produkte: ${inquiryItems}`)}`;

  return (
    <main className="flex-1 bg-[#faf7f2]">
      <div className="mx-auto w-full max-w-360 px-4 py-8 sm:px-8 sm:py-12">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Link className="hover:text-primary" href="/">
            Startseite
          </Link>
          <span aria-hidden="true">/</span>
          <strong className="font-medium text-foreground">Warenkorb</strong>
        </nav>

        {cart.items.length === 0 ? (
          <div className="mt-8">
            <EmptyCart />
          </div>
        ) : (
          <>
            <header className="mt-8 flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.16em] uppercase before:block before:size-2 before:bg-primary">
                  Ihre Auswahl
                </p>
                <h1 className="mt-4 text-4xl leading-none font-semibold tracking-[-0.05em] sm:text-5xl">
                  Warenkorb
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                  {itemCount} {itemCount === 1 ? "Artikel" : "Artikel"} für Ihr
                  Zuhause
                </p>
              </div>
              <ol className="flex items-center gap-2 text-[0.625rem] font-semibold tracking-wide uppercase sm:gap-3">
                <li className="flex items-center gap-2 text-foreground">
                  <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
                    1
                  </span>
                  Warenkorb
                </li>
                <li aria-hidden="true" className="h-px w-5 bg-border sm:w-8" />
                <li className="flex items-center gap-2 text-muted-foreground">
                  <span className="grid size-7 place-items-center rounded-full border">
                    2
                  </span>
                  Anfrage
                </li>
                <li
                  aria-hidden="true"
                  className="hidden h-px w-8 bg-border sm:block"
                />
                <li className="hidden items-center gap-2 text-muted-foreground sm:flex">
                  <span className="grid size-7 place-items-center rounded-full border">
                    3
                  </span>
                  Bestätigung
                </li>
              </ol>
            </header>

            {(error || cart.messages.length > 0) && (
              <div
                className="mt-6 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                role="alert"
              >
                {error && (
                  <p>
                    Der Warenkorb konnte nicht aktualisiert werden. Bitte
                    versuchen Sie es erneut.
                  </p>
                )}
                {cart.messages.map((message) => (
                  <p key={message}>{message}</p>
                ))}
              </div>
            )}

            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] xl:gap-12">
              <div>
                <section className="divide-y rounded-3xl border bg-card p-5 shadow-[0_22px_70px_-55px_rgba(21,21,19,0.7)] sm:p-7">
                  {cart.items.map((item) => (
                    <CartItemRow
                      currency={cart.currency}
                      editable={cart.editable}
                      item={item}
                      key={item.id}
                      locale={cart.locale}
                    />
                  ))}
                </section>

                <Link
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold hover:text-primary"
                  href="/moebel-sortiment"
                >
                  <ArrowLeft className="size-4" />
                  Weiter einkaufen
                </Link>
              </div>

              <aside className="rounded-3xl border border-[#d8c8b8] bg-[#eadfd2] p-6 text-foreground shadow-[0_28px_75px_-52px_rgba(91,67,43,0.5)] lg:sticky lg:top-24 sm:p-7">
                <p className="text-xs font-semibold tracking-[0.15em] text-foreground/55 uppercase">
                  Zusammenfassung
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  Ihre Bestellung
                </h2>

                <dl className="mt-7 space-y-3 text-sm">
                  <div className="flex justify-between gap-4 text-foreground/65">
                    <dt>Zwischensumme</dt>
                    <dd>{formatter.format(cart.subtotal)}</dd>
                  </div>
                  {cart.adjustments.map((adjustment) => (
                    <div
                      className="flex justify-between gap-4 font-medium text-primary"
                      key={adjustment.id}
                    >
                      <dt>{adjustment.label}</dt>
                      <dd>{formatter.format(adjustment.price)}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between gap-4 text-foreground/65">
                    <dt>Versand</dt>
                    <dd>
                      {cart.shippingCosts === 0
                        ? "Kostenlos"
                        : formatter.format(cart.shippingCosts)}
                    </dd>
                  </div>
                  <div className="flex items-end justify-between gap-4 border-t border-foreground/15 pt-5">
                    <dt className="font-semibold">Gesamtsumme</dt>
                    <dd className="text-2xl font-semibold tracking-[-0.04em]">
                      {formatter.format(cart.total)}
                    </dd>
                  </div>
                </dl>

                {cart.editable && (
                  <form
                    action={applyPromotionCode}
                    className="mt-6 border-t border-foreground/15 pt-6"
                  >
                    <label
                      className="text-xs font-medium text-foreground/65"
                      htmlFor="promotion-code"
                    >
                      Gutscheincode
                    </label>
                    <div className="mt-2 flex gap-2">
                      <Input
                        className="h-11 border-foreground/15 bg-background/70 text-foreground placeholder:text-muted-foreground"
                        id="promotion-code"
                        name="code"
                        placeholder="Code eingeben"
                        required
                      />
                      <Button
                        className="h-11 border border-foreground/10 bg-background px-4 text-foreground hover:bg-background/80"
                        type="submit"
                      >
                        Anwenden
                      </Button>
                    </div>
                  </form>
                )}

                <Button
                  className="mt-7 w-full justify-between bg-primary hover:bg-primary/85"
                  nativeButton={false}
                  render={<a href={inquiryHref} />}
                  size="lg"
                >
                  Bestellung anfragen
                  <span className="grid size-7 place-items-center rounded-full bg-primary-foreground/20">
                    <ArrowRight className="size-4" />
                  </span>
                </Button>
                <p className="mt-3 text-center text-[0.6875rem] leading-5 text-foreground/55">
                  Wir bestätigen Verfügbarkeit und Liefertermin persönlich.
                </p>

                <ul className="mt-6 grid gap-3 border-t border-foreground/15 pt-6 text-xs text-foreground/65">
                  <li className="flex items-center gap-2.5">
                    <ShieldCheck className="size-4 text-primary" />
                    Sichere und persönliche Beratung
                  </li>
                  <li className="flex items-center gap-2.5">
                    <PackageCheck className="size-4 text-primary" />
                    Verfügbarkeit wird vorab geprüft
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-primary" />
                    Transparente Bestellübersicht
                  </li>
                </ul>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
