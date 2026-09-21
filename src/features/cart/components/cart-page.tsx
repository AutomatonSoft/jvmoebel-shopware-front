import {
  ArrowLeft,
  ArrowRight,
  Check,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { CartCheckoutDialog } from "@/features/cart/components/cart-checkout-dialog";
import { CartLineItem } from "@/features/cart/components/cart-line-item";
import { CartProductRails } from "@/features/cart/components/cart-product-rail";
import type { ShopProductListing } from "@/features/catalog/model/product-listing";
import {
  getShopCartItemCount,
  type ShopCart,
} from "@/features/cart/model/cart";
import { applyPromotionCode } from "@/features/cart/server/actions";

type CartPageProps = Readonly<{
  cart: ShopCart;
  recommendations: ShopProductListing | null;
  signedIn: boolean;
}>;

function EmptyCart({ signedIn }: Readonly<{ signedIn: boolean }>) {
  if (signedIn) {
    return (
      <section className="py-16 text-center sm:py-24">
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

  return (
    <section className="px-4 py-14 text-center sm:py-20">
      <span className="relative mx-auto grid size-15 place-items-center rounded-full bg-accent/65 text-foreground">
        <ShoppingCart className="size-7" strokeWidth={1.5} />
        <span className="absolute -top-1.5 -right-2 h-5 w-px rotate-35 bg-primary" />
        <span className="absolute -top-2 -right-0.5 h-6 w-px rotate-12 bg-primary" />
        <span className="absolute -top-1.5 right-2 h-5 w-px -rotate-12 bg-primary" />
      </span>
      <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Dein Warenkorb ist leer.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
        Lass dich von unserer Auswahl inspirieren und fülle deinen Warenkorb mit
        Lieblingsstücken. Du kannst dich auch mit deinem Kundenkonto anmelden,
        um bereits gespeicherte Artikel zu sehen.
      </p>
      <div className="mx-auto mt-7 grid max-w-sm gap-3">
        <Button
          className="w-full"
          nativeButton={false}
          render={<Link href="/moebel-sortiment" />}
          size="lg"
        >
          Weiter
        </Button>
        <Button
          className="w-full"
          nativeButton={false}
          render={<Link href="/kundenkonto/anmelden" />}
          size="lg"
          variant="outline"
        >
          Anmelden
        </Button>
      </div>
      <Link
        className="mt-5 inline-flex text-sm font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-primary"
        href="/kundenkonto/registrieren"
      >
        Noch kein Konto? Jetzt registrieren
      </Link>
    </section>
  );
}

export function CartPage({ cart, recommendations, signedIn }: CartPageProps) {
  const formatter = new Intl.NumberFormat(cart.locale, {
    currency: cart.currency,
    minimumFractionDigits: 2,
    style: "currency",
  });
  const itemCount = getShopCartItemCount(cart);
  return (
    <main className="flex-1 bg-[#faf7f2]">
      <Container className="py-6 sm:py-8">
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
          <div className="mt-5">
            <EmptyCart signedIn={signedIn} />
            {recommendations && (
              <CartProductRails recommendations={recommendations} />
            )}
          </div>
        ) : (
          <>
            <PageHeader
              aside={
                <ol className="flex items-center gap-2 text-[0.625rem] font-semibold tracking-wide uppercase sm:gap-3">
                  <li className="flex items-center gap-2 text-foreground">
                    <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
                      1
                    </span>
                    Warenkorb
                  </li>
                  <li
                    aria-hidden="true"
                    className="h-px w-5 bg-border sm:w-8"
                  />
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span className="grid size-7 place-items-center rounded-full border">
                      2
                    </span>
                    Kasse
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
              }
              className="mt-5"
              description={`${itemCount} ${itemCount === 1 ? "Artikel" : "Artikel"} für Ihr Zuhause`}
              eyebrow="Ihre Auswahl"
              title="Warenkorb"
            />

            <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] xl:gap-12">
              <div>
                <section className="divide-y rounded-3xl border bg-card p-5 shadow-[0_22px_70px_-55px_rgba(21,21,19,0.7)] sm:p-7">
                  {cart.items.map((item) => (
                    <CartLineItem
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

                <CartCheckoutDialog signedIn={signedIn} />
                <p className="mt-3 text-center text-[0.6875rem] leading-5 text-foreground/55">
                  Sicher bestellen – mit Kundenkonto oder als Gast.
                </p>

                <ul className="mt-6 grid gap-3 border-t border-foreground/15 pt-6 text-xs text-foreground/65">
                  <li className="flex items-center gap-2.5">
                    <ShieldCheck className="size-4 text-primary" />
                    Sicherer Checkout ohne Registrierung
                  </li>
                  <li className="flex items-center gap-2.5">
                    <PackageCheck className="size-4 text-primary" />
                    Versand und Zahlung transparent wählen
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
      </Container>
    </main>
  );
}
