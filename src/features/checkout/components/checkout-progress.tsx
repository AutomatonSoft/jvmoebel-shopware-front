import { Check } from "lucide-react";

export function CheckoutProgress({
  step,
}: Readonly<{ step: "address" | "payment" }>) {
  return (
    <ol
      aria-label="Checkout-Fortschritt"
      className="flex items-center gap-2 text-[0.625rem] font-semibold tracking-wide uppercase sm:gap-3"
    >
      <li className="flex items-center gap-2 text-foreground">
        <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
          {step === "payment" ? (
            <Check aria-hidden="true" className="size-3.5" />
          ) : (
            "1"
          )}
        </span>
        Adresse
      </li>
      <li aria-hidden="true" className="h-px w-5 bg-border sm:w-8" />
      <li
        aria-current={step === "payment" ? "step" : undefined}
        className={
          step === "payment"
            ? "flex items-center gap-2 text-foreground"
            : "flex items-center gap-2 text-muted-foreground"
        }
      >
        <span
          className={
            step === "payment"
              ? "grid size-7 place-items-center rounded-full bg-primary text-primary-foreground"
              : "grid size-7 place-items-center rounded-full border"
          }
        >
          2
        </span>
        Zahlung
      </li>
      <li aria-hidden="true" className="hidden h-px w-8 bg-border sm:block" />
      <li className="hidden items-center gap-2 text-muted-foreground sm:flex">
        <span className="grid size-7 place-items-center rounded-full border">
          3
        </span>
        Bestätigung
      </li>
    </ol>
  );
}
