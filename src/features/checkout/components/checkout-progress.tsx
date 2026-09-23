import { Check } from "lucide-react";

const journeySteps = [
  { id: "cart", label: "Warenkorb" },
  { id: "checkout", label: "Kasse" },
  { id: "confirmation", label: "Bestätigung" },
] as const;

const detailSteps = [
  { id: "address", label: "Adresse" },
  { id: "payment", label: "Zahlung" },
  { id: "review", label: "Prüfen" },
] as const;

type CheckoutProgressProps =
  | Readonly<{
      step: (typeof journeySteps)[number]["id"];
      variant?: "journey";
    }>
  | Readonly<{
      step: (typeof detailSteps)[number]["id"];
      variant: "details";
    }>;

export function CheckoutProgress(props: CheckoutProgressProps) {
  const steps = props.variant === "details" ? detailSteps : journeySteps;
  const step = props.step;
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
          <li
            className={`flex items-center gap-2 ${index === 2 ? "hidden sm:flex" : ""}`}
            key={item.id}
          >
            {index > 0 && (
              <span
                aria-hidden="true"
                className={`h-px w-5 bg-border sm:w-8 ${index === 2 ? "hidden sm:block" : ""}`}
              />
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
              {item.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
