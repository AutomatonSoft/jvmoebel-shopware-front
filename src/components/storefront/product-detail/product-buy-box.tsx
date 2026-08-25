import { RotateCcw, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";

import { ProductOptions } from "@/components/storefront/product-detail/product-options";
import { Button } from "@/components/ui/button";
import type {
  ShopProductDetail,
  ShopProductPurchaseNote,
} from "@/lib/shopware/product-detail";

export type ProductBuyBoxProps = {
  currency: string;
  locale: string;
  product: ShopProductDetail;
};

const purchaseNoteIcons = {
  delivery: Truck,
  returns: RotateCcw,
  warranty: ShieldCheck,
} satisfies Record<ShopProductPurchaseNote["kind"], typeof Truck>;

export function ProductBuyBox({
  currency,
  locale,
  product,
}: ProductBuyBoxProps) {
  const priceFormatter = new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  });
  const discount =
    product.previousPrice && product.previousPrice > product.unitPrice
      ? Math.round((1 - product.unitPrice / product.previousPrice) * 100)
      : undefined;

  return (
    <aside className="min-w-0 lg:sticky lg:top-24 lg:py-2">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          {product.company}
        </p>
        <span className="text-[0.625rem] text-muted-foreground">
          {product.productNumber}
        </span>
      </div>

      <h1 className="mt-4 max-w-full text-3xl leading-[1.06] font-semibold tracking-[-0.04em] text-pretty [overflow-wrap:anywhere] sm:text-4xl xl:text-[2.75rem]">
        {product.name}
      </h1>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <p className="flex flex-wrap items-baseline gap-2.5">
          <strong className="text-3xl leading-none font-bold sm:text-4xl">
            {priceFormatter.format(product.unitPrice)}
          </strong>
          {product.previousPrice && (
            <del className="text-sm text-muted-foreground">
              {priceFormatter.format(product.previousPrice)}
            </del>
          )}
          {discount && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[0.625rem] font-bold text-primary-foreground">
              âˆ’{discount}%
            </span>
          )}
        </p>

        {product.rating !== undefined && (
          <p className="flex items-center gap-1.5 text-xs">
            <Star className="size-4 fill-primary text-primary" />
            <strong>{product.rating.toFixed(1)}</strong>
            {product.reviewCount !== undefined && (
              <span className="text-muted-foreground">
                {product.reviewCount} reviews
              </span>
            )}
          </p>
        )}
      </div>

      <div className="mt-5">
        <ProductOptions
          currency={currency}
          groups={product.optionGroups}
          locale={locale}
        />
      </div>

      <div className="my-5 space-y-3 rounded-xl bg-muted/70 p-4">
        {product.purchaseNotes.map((note) => {
          const Icon = purchaseNoteIcons[note.kind];

          return (
            <p
              className="flex items-start gap-3 text-xs leading-5"
              key={note.id}
            >
              <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{note.text}</span>
            </p>
          );
        })}
      </div>

      <div className="grid gap-2.5">
        <Button className="w-full" size="lg" type="button">
          Add to bag
          <ShoppingBag className="size-4" />
        </Button>
        <Button className="w-full" size="lg" type="button" variant="outline">
          Ask about this product
        </Button>
      </div>
    </aside>
  );
}
