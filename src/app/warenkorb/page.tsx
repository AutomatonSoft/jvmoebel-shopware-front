import type { Metadata } from "next";

import { CartPage } from "@/features/cart/components/cart-page";
import { getShopCart } from "@/features/cart/server/cart";
import { ErrorExperience } from "@/features/storefront-shell/components/error-experience";

export const metadata: Metadata = {
  description:
    "Prüfen Sie Ihre Möbelauswahl und senden Sie Ihre Bestellanfrage an JVMöbel.",
  title: "Warenkorb | JVMöbel",
};

type CartRouteProps = Readonly<{
  searchParams: Promise<{ fehler?: string | string[] }>;
}>;

export default async function CartRoute({ searchParams }: CartRouteProps) {
  const [cartResult, parameters] = await Promise.allSettled([
    getShopCart(),
    searchParams,
  ]);

  if (cartResult.status === "rejected") {
    console.error("Cart loading failed.", cartResult.reason);

    return (
      <ErrorExperience
        code="CART"
        description="Die Warenkorbdaten konnten gerade nicht geladen werden. Bitte versuchen Sie es in wenigen Augenblicken erneut."
        eyebrow="Warenkorb nicht erreichbar"
        title="Ihre Auswahl ist weiterhin sicher."
      />
    );
  }

  const error =
    parameters.status === "fulfilled"
      ? Array.isArray(parameters.value.fehler)
        ? parameters.value.fehler[0]
        : parameters.value.fehler
      : undefined;

  return <CartPage cart={cartResult.value} error={error} />;
}
