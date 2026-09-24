"use client";

import { Minus, ShoppingBag, Plus, Trash2, Truck } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import type { ShopCartItem } from "@/features/cart/model/cart";
import { removeCartItem, updateCartItem } from "@/features/cart/server/actions";

function QuantityControl({
  item,
  returnTo,
}: Readonly<{ item: ShopCartItem; returnTo?: string }>) {
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
        {returnTo && <input name="returnTo" type="hidden" value={returnTo} />}
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
        {returnTo && <input name="returnTo" type="hidden" value={returnTo} />}
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

export function CartLineItem({
  currency,
  editable,
  item,
  locale,
  returnTo,
}: Readonly<{
  currency: string;
  editable: boolean;
  item: ShopCartItem;
  locale: string;
  returnTo?: string;
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
    />
  ) : (
    <ShoppingBag className="size-8 text-muted-foreground" />
  );

  return (
    <article className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 py-6 first:pt-0 last:pb-0 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:gap-6">
      {item.url ? (
        <Link
          aria-label={item.label}
          className="relative grid aspect-square place-items-center overflow-hidden rounded-2xl bg-muted/65 p-3"
          href={item.url as Route}
        >
          {content}
        </Link>
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
          {item.url ? (
            <Link href={item.url as Route}>{item.label}</Link>
          ) : (
            item.label
          )}
        </h2>
        {item.deliveryLabel && (
          <p className="mt-2 flex items-center gap-2 text-xs leading-5 text-muted-foreground sm:text-sm">
            <Truck className="size-4 shrink-0 text-foreground" />
            {item.deliveryLabel}
          </p>
        )}
        {item.selectedOptions.length > 0 && (
          <dl
            aria-label={`Ausgewählte Variante für ${item.label}`}
            className="mt-3 flex flex-wrap gap-1.5"
          >
            {item.selectedOptions.map((option) => (
              <div
                className="flex items-baseline gap-1 rounded-md bg-secondary px-2 py-1 text-xs"
                key={`${option.label}-${option.value}`}
              >
                <dt className="font-medium text-muted-foreground">
                  {option.label}:
                </dt>
                <dd className="font-semibold text-foreground">
                  {option.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
        <div className="mt-auto hidden items-end gap-3 pt-4 sm:flex">
          {editable ? (
            <QuantityControl item={item} returnTo={returnTo} />
          ) : (
            <span className="text-xs font-medium text-muted-foreground">
              Menge {item.quantity}
            </span>
          )}
          {editable && item.removable && (
            <form action={removeCartItem}>
              <input name="id" type="hidden" value={item.id} />
              {returnTo && (
                <input name="returnTo" type="hidden" value={returnTo} />
              )}
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
              <QuantityControl item={item} returnTo={returnTo} />
            ) : (
              <span className="text-xs font-medium text-muted-foreground">
                Menge {item.quantity}
              </span>
            )}
            {editable && item.removable && (
              <form action={removeCartItem}>
                <input name="id" type="hidden" value={item.id} />
                {returnTo && (
                  <input name="returnTo" type="hidden" value={returnTo} />
                )}
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
