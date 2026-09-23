import { Check } from "lucide-react";

import type { CheckoutStep } from "@/features/checkout/model/checkout-step";

const steps = [
  { id: "address", label: "Adresse" },
  { id: "payment", label: "Zahlung" },
  { id: "review", label: "Prüfen" },
] as const;

export function CheckoutProgress({ step }: Readonly<{ step: CheckoutStep }>) {
  const currentIndex = steps.findIndex((item) => item.id === step);

  return (
    <ol
      aria-label="Checkout-Fortschritt"
      className="flex items-center gap-2 text-[0.625rem] font-semibold tracking-wide uppercase sm:gap-3"
    >
      {steps.map((item, index) => {
        const completed = index < currentIndex;
        const current = index === currentIndex;

        return (
          <li className="flex items-center gap-2" key={item.id}>
            {index > 0 && (
              <span aria-hidden="true" className="h-px w-4 bg-border sm:w-8" />
            )}
            <span
              aria-current={current ? "step" : undefined}
              className={`flex items-center gap-2 ${current || completed ? "text-foreground" : "text-muted-foreground"}`}
            >
              <span
                className={`grid size-7 place-items-center rounded-full ${current || completed ? "bg-primary text-primary-foreground" : "border"}`}
              >
                {completed ? (
                  <Check aria-hidden="true" className="size-3.5" />
                ) : (
                  index + 1
                )}
              </span>
              <span className={current ? undefined : "hidden sm:inline"}>
                {item.label}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
