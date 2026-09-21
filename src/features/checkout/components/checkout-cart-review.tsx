"use client";

import { Minus, Package, Plus, Trash2, Truck } from "lucide-react";
import Image from "next/image";
import type { Route } from "next";
import Link from "next/link";

import type { ShopCart, ShopCartItem } from "@/features/cart/model/cart";
import { removeCartItem, updateCartItem } from "@/features/cart/server/actions";

const checkoutReturnPath = "/kasse?schritt=bestaetigung";

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
      className="inline-flex h-9 items-center rounded-full border bg-background p-1"
    >
      <form action={updateCartItem}>
        <input name="id" type="hidden" value={item.id} />
        <input
          name="quantity"
          type="hidden"
          value={Math.max(item.minQuantity, item.quantity - item.quantityStep)}
        />
        <input name="returnTo" type="hidden" value={checkoutReturnPath} />
        <button
          aria-label="Menge verringern"
          className="grid size-7 place-items-center rounded-full hover:bg-muted disabled:cursor-not-allowed disabled:opacity-35"
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
        <input name="returnTo" type="hidden" value={checkoutReturnPath} />
        <button
          aria-label="Menge erhöhen"
          className="grid size-7 place-items-center rounded-full hover:bg-muted disabled:cursor-not-allowed disabled:opacity-35"
          disabled={item.quantity >= item.maxQuantity}
          type="submit"
        >
          <Plus className="size-3.5" />
        </button>
      </form>
    </div>
  );
}

function CartItem({
  currency,
  item,
  locale,
}: Readonly<{
  currency: string;
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
      sizes="80px"
      src={item.image.url}
      unoptimized={item.image.url.startsWith("http")}
    />
  ) : (
    <Package aria-hidden="true" className="size-7 text-muted-foreground" />
  );

  return (
    <article className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[5rem_minmax(0,1fr)_auto]">
      {item.url ? (
        <Link
          aria-label={item.label}
          className="relative grid aspect-square place-items-center overflow-hidden rounded-xl bg-secondary/65 p-2"
          href={item.url as Route}
        >
          {content}
        </Link>
      ) : (
        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-xl bg-secondary/65 p-2">
          {content}
        </div>
      )}
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm leading-5 font-semibold">
          {item.url ? (
            <Link href={item.url as Route}>{item.label}</Link>
          ) : (
            item.label
          )}
        </h3>
        {item.selectedOptions.length > 0 && (
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {item.selectedOptions
              .map((option) => `${option.label}: ${option.value}`)
              .join(" · ")}
          </p>
        )}
        {item.deliveryLabel && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Truck aria-hidden="true" className="size-3.5 text-primary" />
            {item.deliveryLabel}
          </p>
        )}
        <div className="mt-3 flex items-center gap-2">
          <QuantityControl item={item} />
          {item.removable && (
            <form action={removeCartItem}>
              <input name="id" type="hidden" value={item.id} />
              <input name="returnTo" type="hidden" value={checkoutReturnPath} />
              <button
                aria-label={`${item.label} entfernen`}
                className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                type="submit"
              >
                <Trash2 className="size-4" />
              </button>
            </form>
          )}
        </div>
      </div>
      <strong className="col-start-2 text-right text-sm sm:col-start-3 sm:row-start-1">
        {formatter.format(item.totalPrice)}
      </strong>
    </article>
  );
}

export function CheckoutCartReview({ cart }: Readonly<{ cart: ShopCart }>) {
  const itemCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <section className="mt-4 rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <h2 className="text-sm font-semibold">Dein Warenkorb</h2>
        <span className="text-xs text-muted-foreground">
          {itemCount} {itemCount === 1 ? "Artikel" : "Artikel"}
        </span>
      </div>
      <div className="divide-y">
        {cart.items.map((item) => (
          <CartItem
            currency={cart.currency}
            item={item}
            key={item.id}
            locale={cart.locale}
          />
        ))}
      </div>
    </section>
  );
}
