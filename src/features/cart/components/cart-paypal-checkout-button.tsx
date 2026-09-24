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
      className="h-12 w-full rounded-xl border-border bg-background text-sm font-semibold text-foreground shadow-none hover:border-foreground/25 hover:bg-muted"
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
