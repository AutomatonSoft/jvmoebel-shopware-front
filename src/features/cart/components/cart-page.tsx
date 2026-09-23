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
import { PageHeader } from "@/components/ui/page-header";
import { CartCheckoutDialog } from "@/features/cart/components/cart-checkout-dialog";
import { CartLineItem } from "@/features/cart/components/cart-line-item";
import { CartPromotionCode } from "@/features/cart/components/cart-promotion-code";
import { CartProductRails } from "@/features/cart/components/cart-product-rail";
import type { ShopProductListing } from "@/features/catalog/model/product-listing";
import {
  getShopCartItemCount,
  type ShopCart,
} from "@/features/cart/model/cart";

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

              <aside className="rounded-3xl border bg-card p-6 text-foreground shadow-[0_24px_70px_-58px_rgba(21,21,19,0.7)] lg:sticky lg:top-24 sm:p-7">
                <div className="flex items-baseline justify-between gap-4 border-b pb-5">
                  <h2 className="text-xl font-semibold tracking-[-0.035em]">
                    Ihre Bestellung
                  </h2>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {itemCount} {itemCount === 1 ? "Artikel" : "Artikel"}
                  </span>
                </div>

                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-4 text-muted-foreground">
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
                  <div className="flex justify-between gap-4 text-muted-foreground">
                    <dt>Versand</dt>
                    <dd>
                      {cart.shippingCosts === 0
                        ? "Kostenlos"
                        : formatter.format(cart.shippingCosts)}
                    </dd>
                  </div>
                  <div className="flex items-end justify-between gap-4 border-t pt-5">
                    <dt className="font-semibold">Gesamtsumme</dt>
                    <dd className="text-2xl font-bold tracking-[-0.04em]">
                      {formatter.format(cart.total)}
                    </dd>
                  </div>
                </dl>

                <CartCheckoutDialog signedIn={signedIn} />
                {cart.editable && <CartPromotionCode />}

                <ul className="mt-5 grid gap-2.5 border-t pt-5 text-xs leading-5 text-muted-foreground">
                  <li className="flex items-center gap-2.5">
                    <ShieldCheck
                      aria-hidden="true"
                      className="size-4 text-primary"
                    />
                    SSL-verschlüsselter Checkout
                  </li>
                  <li className="flex items-center gap-2.5">
                    <PackageCheck
                      aria-hidden="true"
                      className="size-4 text-primary"
                    />
                    Bestellen mit oder ohne Kundenkonto
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check aria-hidden="true" className="size-4 text-primary" />
                    Versandkosten vor Abschluss sichtbar
                  </li>
                </ul>
              </aside>
            </div>
            {recommendations && (
              <CartProductRails recommendations={recommendations} />
            )}
          </>
        )}
      </Container>
    </main>
  );
}
