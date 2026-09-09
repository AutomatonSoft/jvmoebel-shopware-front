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
    return <CartAccountRequired />;
  }

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
  const success =
    parameters.status === "fulfilled"
      ? Array.isArray(parameters.value.meldung)
        ? parameters.value.meldung[0]
        : parameters.value.meldung
      : undefined;

  return (
    <>
      <CartNotifications
        error={error}
        messages={cartResult.value.messages}
        success={success}
      />
      <CartPage cart={cartResult.value} />
    </>
  );
}
