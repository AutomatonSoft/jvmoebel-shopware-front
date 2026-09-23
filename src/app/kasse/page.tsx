import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CheckoutPage } from "@/features/checkout/components/checkout-page";
import { getCheckoutPageData } from "@/features/checkout/server/checkout";
import { ErrorExperience } from "@/features/storefront-shell/components/error-experience";

export const metadata: Metadata = {
  description:
    "Bestellen Sie Ihre Moebel sicher mit Kundenkonto oder ohne Registrierung.",
  title: "Kasse | JVMoebel",
};

type CheckoutRouteProps = Readonly<{
  searchParams: Promise<{
    fehler?: string | string[];
    schritt?: string | string[];
    zurueck?: string | string[];
  }>;
}>;

export default async function CheckoutRoute({
  searchParams,
}: CheckoutRouteProps) {
  const parameters = await searchParams;
  const error = Array.isArray(parameters.fehler)
    ? parameters.fehler[0]
    : parameters.fehler;
  const step = Array.isArray(parameters.schritt)
    ? parameters.schritt[0]
    : parameters.schritt;
  const returnStep = Array.isArray(parameters.zurueck)
    ? parameters.zurueck[0]
    : parameters.zurueck;
  let data: Awaited<ReturnType<typeof getCheckoutPageData>>;

  try {
    data = await getCheckoutPageData();
  } catch (checkoutError) {
    console.error("Checkout loading failed.", checkoutError);

    return (
      <ErrorExperience
        code="CHECKOUT"
        description="Die Kasse konnte gerade nicht geladen werden. Bitte versuchen Sie es in wenigen Augenblicken erneut."
        eyebrow="Checkout nicht erreichbar"
        title="Ihre Auswahl bleibt im Warenkorb."
      />
    );
  }

  if (data.cart.items.length === 0) {
    redirect("/warenkorb");
  }

  return (
    <CheckoutPage
      addressStep={step === "adresse"}
      confirmationStep={step === "bestaetigung"}
      data={data}
      deliveryAddressStep={step === "lieferadresse"}
      emailStep={step === "email"}
      newDeliveryAddressStep={step === "neue-lieferadresse"}
      newBillingAddressStep={step === "neue-rechnungsadresse"}
      paymentError={error === "zahlung"}
      paymentStep={step === "zahlung"}
      returnToConfirmation={returnStep === "bestaetigung"}
    />
  );
}
