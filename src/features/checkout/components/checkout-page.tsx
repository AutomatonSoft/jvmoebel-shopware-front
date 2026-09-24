import type { Route } from "next";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { CheckoutCartPreview } from "@/features/checkout/components/checkout-cart-preview";
import { CheckoutEmailForm } from "@/features/checkout/components/checkout-email-form";
import { GuestCheckoutFlow } from "@/features/checkout/components/guest-checkout-flow";
import { CheckoutPaymentForm } from "@/features/checkout/components/checkout-payment-form";
import { CheckoutProgress } from "@/features/checkout/components/checkout-progress";
import { CheckoutReview } from "@/features/checkout/components/checkout-review";
import {
  CheckoutSummary,
  type CheckoutSummaryAction,
} from "@/features/checkout/components/checkout-summary";
import { CustomerCheckoutDeliveryAddressForm } from "@/features/checkout/components/customer-checkout-delivery-address-form";
import { CustomerCheckoutDeliveryAddressEditForm } from "@/features/checkout/components/customer-checkout-delivery-address-edit-form";
import { CustomerCheckoutAddressForm } from "@/features/checkout/components/customer-checkout-address-form";
import { CustomerCheckoutNewBillingAddressForm } from "@/features/checkout/components/customer-checkout-new-billing-address-form";
import type { CheckoutPageData } from "@/features/checkout/model/checkout";
import {
  hasAvailableCheckoutSelection,
  resolveCheckoutStep,
  type CheckoutStep,
} from "@/features/checkout/model/checkout-step";

export function CheckoutPage({
  addressStep,
  confirmationStep,
  data,
  deliveryAddressStep,
  emailStep,
  newBillingAddressStep,
  newDeliveryAddressStep,
  paymentError,
  paymentStep,
  returnToConfirmation,
}: Readonly<{
  addressStep: boolean;
  confirmationStep: boolean;
  data: CheckoutPageData;
  deliveryAddressStep: boolean;
  emailStep: boolean;
  newBillingAddressStep: boolean;
  newDeliveryAddressStep: boolean;
  paymentError: boolean;
  paymentStep: boolean;
  returnToConfirmation: boolean;
}>) {
  const editBackHref: Route = returnToConfirmation
    ? "/kasse?schritt=bestaetigung"
    : "/kasse?schritt=zahlung";
  const showNewDeliveryAddressStep =
    newDeliveryAddressStep && !data.customer?.guest;
  const showNewBillingAddressStep =
    newBillingAddressStep && !data.customer?.guest;
  const showDeliveryAddressStep =
    deliveryAddressStep && Boolean(data.customer?.shippingAddress);
  const showEmailStep = emailStep && Boolean(data.customer);
  const requestedStep: CheckoutStep | undefined =
    addressStep ||
    showDeliveryAddressStep ||
    showEmailStep ||
    showNewBillingAddressStep ||
    showNewDeliveryAddressStep
      ? "address"
      : paymentStep
        ? "payment"
        : confirmationStep
          ? "review"
          : undefined;
  const step = resolveCheckoutStep({
    addressComplete: data.customer?.addressComplete ?? false,
    options: data.options,
    requestedStep,
    selection: data.selection,
  });
  const showReview =
    step === "review" &&
    hasAvailableCheckoutSelection(data.selection, data.options);
  const summaryAction: CheckoutSummaryAction = !data.customer
    ? {
        formId: "guest-checkout-form",
        label: "Weiter",
      }
    : showNewDeliveryAddressStep
      ? {
          formId: "customer-checkout-delivery-address-form",
          label: "Lieferadresse verwenden",
        }
      : showNewBillingAddressStep
        ? {
            formId: "customer-checkout-new-billing-address-form",
            label: "Rechnungsadresse verwenden",
          }
        : showDeliveryAddressStep
          ? {
              formId: "customer-checkout-delivery-address-edit-form",
              label: "Lieferadresse speichern",
            }
          : showEmailStep
            ? {
                formId: "checkout-email-form",
                label: "E-Mail-Adresse speichern",
              }
            : step === "address"
              ? {
                  formId: "customer-checkout-address-form",
                  label:
                    addressStep && data.customer.addressComplete
                      ? "Änderungen speichern"
                      : "Weiter zu Versand und Zahlung",
                }
              : showReview
                ? {
                    formId: "checkout-order-review-form",
                    label: "Zahlungspflichtig bestellen",
                    requiresTerms: true,
                  }
                : {
                    disabled:
                      data.options.paymentMethods.length === 0 ||
                      data.options.shippingMethods.length === 0,
                    formId: "checkout-payment-form",
                    label: "Weiter zur Bestellübersicht",
                  };

  return (
    <main className="flex-1 bg-background">
      <Container className="py-4 sm:py-5">
        <PageHeader
          aside={data.customer ? <CheckoutProgress step={step} /> : undefined}
          description={
            data.customer
              ? `Bestellung für ${data.customer.firstName} ${data.customer.lastName}`
              : "Schnell und sicher ohne Kundenkonto bestellen"
          }
          eyebrow="Checkout"
          title="Kasse"
        />

        {paymentError && (
          <p className="mt-5 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-sm leading-6 text-destructive">
            Die Zahlung konnte nicht abgeschlossen werden. Ihre Bestellung ist
            gespeichert; wählen Sie die Zahlungsart bitte erneut.
          </p>
        )}

        {!data.customer ? (
          <GuestCheckoutFlow
            cart={data.cart}
            countries={data.options.countries}
            paymentMethods={data.options.paymentMethods}
            shippingMethods={data.options.shippingMethods}
          />
        ) : (
          <div className="mt-5 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] xl:gap-12">
            <div>
              {showNewBillingAddressStep ? (
                <CustomerCheckoutNewBillingAddressForm
                  backHref={editBackHref}
                  countries={data.options.countries}
                  customer={data.customer}
                />
              ) : showNewDeliveryAddressStep ? (
                <CustomerCheckoutDeliveryAddressForm
                  backHref={editBackHref}
                  countries={data.options.countries}
                  customer={data.customer}
                />
              ) : showDeliveryAddressStep && data.customer.shippingAddress ? (
                <CustomerCheckoutDeliveryAddressEditForm
                  address={data.customer.shippingAddress}
                  backHref={editBackHref}
                  countries={data.options.countries}
                />
              ) : showEmailStep ? (
                <CheckoutEmailForm
                  backHref={editBackHref}
                  email={data.customer.email}
                  guest={data.customer.guest}
                />
              ) : step === "address" ? (
                <CustomerCheckoutAddressForm
                  backHref={
                    data.customer.addressComplete ? editBackHref : undefined
                  }
                  countries={data.options.countries}
                  customer={data.customer}
                />
              ) : showReview &&
                data.customer.billingAddress &&
                (data.customer.shippingAddress ??
                  data.customer.billingAddress) &&
                data.selection ? (
                <CheckoutReview
                  billingAddress={data.customer.billingAddress}
                  cart={data.cart}
                  deliveryAddress={
                    data.customer.shippingAddress ??
                    data.customer.billingAddress
                  }
                  email={data.customer.email}
                  paymentMethods={data.options.paymentMethods}
                  selection={data.selection}
                  shippingMethods={data.options.shippingMethods}
                />
              ) : (
                <CheckoutPaymentForm
                  billingAddress={data.customer.billingAddress}
                  canAddBillingAddress={!data.customer.guest}
                  canAddDeliveryAddress={!data.customer.guest}
                  canEditDeliveryAddress={Boolean(
                    data.customer.shippingAddress,
                  )}
                  deliveryAddress={
                    data.customer.shippingAddress ??
                    data.customer.billingAddress
                  }
                  deliveryAddresses={data.customer.shippingAddresses}
                  email={data.customer.email}
                  paymentMethods={data.options.paymentMethods}
                  selectedPaymentMethodId={data.options.selectedPaymentMethodId}
                  selectedShippingMethodId={
                    data.options.selectedShippingMethodId
                  }
                  selectedDeliveryAddressId={
                    data.customer.activeShippingAddressId
                  }
                  shippingMethods={data.options.shippingMethods}
                />
              )}
              {!showReview && <CheckoutCartPreview cart={data.cart} />}
            </div>
            <CheckoutSummary action={summaryAction} cart={data.cart} />
          </div>
        )}
      </Container>
    </main>
  );
}
