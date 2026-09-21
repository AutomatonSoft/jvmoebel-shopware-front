import { Button } from "@/components/ui/button";

type CartPayPalCheckoutButtonProps = {
  onCheckout?: () => void;
};

export function CartPayPalCheckoutButton({
  onCheckout,
}: Readonly<CartPayPalCheckoutButtonProps>) {
  return (
    <Button
      className="mt-3 h-13 w-full border-foreground/20 bg-background text-foreground hover:bg-muted"
      onClick={onCheckout}
      type="button"
      variant="outline"
    >
      <span className="flex items-center gap-1.5">
        Mit
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="PayPal"
          className="h-5 w-auto"
          height={20}
          src="/images/icons/paypal.webp"
          width={72}
        />
        zahlen
      </span>
    </Button>
  );
}
