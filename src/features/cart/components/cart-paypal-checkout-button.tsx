import { Button } from "@/components/ui/button";

type CartPayPalCheckoutButtonProps = {
  onCheckout?: () => void;
};

export function CartPayPalCheckoutButton({
  onCheckout,
}: Readonly<CartPayPalCheckoutButtonProps>) {
  return (
    <Button
      aria-label="Mit PayPal zahlen"
      className="mt-3 h-13 w-full border-foreground/20 bg-background text-base text-foreground hover:bg-muted"
      onClick={onCheckout}
      type="button"
      variant="outline"
    >
      <span aria-hidden="true" className="flex items-center gap-1.5">
        Mit
        <span className="relative h-6 w-20 shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="absolute -top-9 -left-12 h-auto w-[8.5rem] max-w-none"
            height={342}
            src="/images/icons/paypal.webp"
            width={512}
          />
        </span>
        zahlen
      </span>
    </Button>
  );
}
