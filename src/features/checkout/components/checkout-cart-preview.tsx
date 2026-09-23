import { ChevronDown, Package } from "lucide-react";
import Image from "next/image";

import { CartLineItem } from "@/features/cart/components/cart-line-item";
import type { ShopCart } from "@/features/cart/model/cart";

const checkoutReturnPath = "/kasse?schritt=bestaetigung";

export function CheckoutCartPreview({ cart }: Readonly<{ cart: ShopCart }>) {
  const itemCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <section className="mt-4 rounded-2xl border bg-card p-5">
      <details className="group">
        <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-4">
            <strong className="text-base font-semibold">
              Dein Warenkorb ({itemCount}{" "}
              {itemCount === 1 ? "Artikel" : "Artikel"})
            </strong>
            <ChevronDown
              aria-hidden="true"
              className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
            />
          </span>
          <span className="mt-5 flex flex-wrap gap-2">
            {cart.items.map((item) => (
              <span
                className="relative grid size-16 place-items-center overflow-hidden rounded-lg border bg-secondary/65 p-2"
                key={item.id}
              >
                {item.image ? (
                  <Image
                    alt={item.image.alt}
                    className="object-contain"
                    fill
                    sizes="64px"
                    src={item.image.url}
                    unoptimized={item.image.url.startsWith("http")}
                  />
                ) : (
                  <Package
                    aria-hidden="true"
                    className="size-5 text-muted-foreground"
                  />
                )}
              </span>
            ))}
          </span>
        </summary>

        <div className="mt-5 divide-y border-t">
          {cart.items.map((item) => (
            <CartLineItem
              currency={cart.currency}
              editable={cart.editable}
              item={item}
              key={item.id}
              locale={cart.locale}
              returnTo={checkoutReturnPath}
            />
          ))}
        </div>
      </details>
    </section>
  );
}
