import type { Metadata } from "next";

import { CartNotifications } from "@/features/cart/components/cart-notifications";
import { CartPage } from "@/features/cart/components/cart-page";
import { getShopCart } from "@/features/cart/server/cart";
import { getCartRecommendations } from "@/features/cart/server/cart-recommendations";
import { getCustomerAccount } from "@/features/customer-account/server/account";
import { ErrorExperience } from "@/features/storefront-shell/components/error-experience";

export const metadata: Metadata = {
  description: "Prüfen Sie Ihre Moebelauswahl und gehen Sie sicher zur Kasse.",
  title: "Warenkorb | JVMoebel",
};

type CartRouteProps = Readonly<{
  searchParams: Promise<{
    fehler?: string | string[];
    meldung?: string | string[];
  }>;
}>;

export default async function CartRoute({ searchParams }: CartRouteProps) {
  const parameters = await searchParams;
  const error = Array.isArray(parameters.fehler)
    ? parameters.fehler[0]
    : parameters.fehler;
  const success = Array.isArray(parameters.meldung)
    ? parameters.meldung[0]
    : parameters.meldung;
  let cart: Awaited<ReturnType<typeof getShopCart>>;
  let account: Awaited<ReturnType<typeof getCustomerAccount>> = null;
  let recommendations: Awaited<
    ReturnType<typeof getCartRecommendations>
  > | null = null;

  try {
    [cart, account] = await Promise.all([
      getShopCart(),
      getCustomerAccount().catch((accountError: unknown) => {
        console.error("Cart customer lookup failed.", accountError);
        return null;
      }),
    ]);

    if (!account && cart.items.length === 0) {
      recommendations = await getCartRecommendations().catch(
        (recommendationError: unknown) => {
          console.error(
            "Cart recommendations failed to load.",
            recommendationError,
          );
          return null;
        },
      );
    }
  } catch (cartError) {
    console.error("Cart loading failed.", cartError);

    return (
      <ErrorExperience
        code="CART"
        description="Die Warenkorbdaten konnten gerade nicht geladen werden. Bitte versuchen Sie es in wenigen Augenblicken erneut."
        eyebrow="Warenkorb nicht erreichbar"
        title="Ihre Auswahl ist weiterhin sicher."
      />
    );
  }

  return (
    <>
      <CartNotifications
        error={error}
        messages={cart.messages}
        success={success}
      />
      <CartPage
        cart={cart}
        recommendations={recommendations}
        signedIn={Boolean(account)}
      />
    </>
  );
}
