"use client";

import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWishlist } from "@/features/wishlist/hooks/use-wishlist";
import { cn } from "@/lib/utils";

type WishlistToggleButtonProps = Readonly<{
  className?: string;
  productId: string;
  productName: string;
  variant?: "card" | "detail";
}>;

export function WishlistToggleButton({
  className,
  productId,
  productName,
  variant = "card",
}: WishlistToggleButtonProps) {
  const { isFavorite, isReady, toggleProduct } = useWishlist();
  const active = isFavorite(productId);
  const accessibleLabel = active
    ? `${productName} aus der Wunschliste entfernen`
    : `${productName} zur Wunschliste hinzufügen`;

  if (variant === "detail") {
    return (
      <Button
        aria-label={accessibleLabel}
        aria-pressed={active}
        className={cn("w-full", className)}
        disabled={!isReady}
        onClick={() => toggleProduct(productId)}
        type="button"
        variant="outline"
      >
        <Heart
          aria-hidden="true"
          className={active ? "fill-primary text-primary" : undefined}
        />
        {active ? "Auf der Wunschliste" : "Zur Wunschliste hinzufügen"}
      </Button>
    );
  }

  return (
    <button
      aria-label={accessibleLabel}
      aria-pressed={active}
      className={cn(
        "absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full border border-white/70 bg-background/90 text-foreground shadow-sm backdrop-blur-md transition-[color,background-color,transform] hover:bg-background hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95 sm:top-4 sm:right-4",
        active &&
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
        className,
      )}
      disabled={!isReady}
      onClick={() => toggleProduct(productId)}
      type="button"
    >
      <Heart
        aria-hidden="true"
        className={cn("size-4", active && "fill-current")}
      />
    </button>
  );
}
