import type { Metadata } from "next";

import { CartAccountRequired } from "@/features/cart/components/cart-account-required";
import { CartNotifications } from "@/features/cart/components/cart-notifications";
import { CartPage } from "@/features/cart/components/cart-page";
import { getShopCart } from "@/features/cart/server/cart";
import { getCustomerAccount } from "@/features/customer-account/server/account";
import { ErrorExperience } from "@/features/storefront-shell/components/error-experience";

export const metadata: Metadata = {
  description:
    "Prüfen Sie Ihre Möbelauswahl und senden Sie Ihre Bestellanfrage an JVMöbel.",
  title: "Warenkorb | JVMöbel",
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
  let account: Awaited<ReturnType<typeof getCustomerAccount>>;

  try {
    account = await getCustomerAccount();
  } catch (error) {
    console.error("Cart customer lookup failed.", error);

    return (
      <ErrorExperience
        code="ACCOUNT"
        description="Der Zugriff auf Ihr Kundenkonto ist momentan nicht möglich. Bitte versuchen Sie es in wenigen Augenblicken erneut."
        eyebrow="Kundenkonto nicht erreichbar"
        title="Ihr Warenkorb bleibt geschützt."
      />
    );
  }

  if (!account) {
    return (
      <>
        <CartNotifications error={error} messages={[]} success={success} />
        <CartAccountRequired />
      </>
    );
  }

  let cart: Awaited<ReturnType<typeof getShopCart>>;

  try {
    cart = await getShopCart();
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
      <CartPage cart={cart} />
    </>
  );
}
