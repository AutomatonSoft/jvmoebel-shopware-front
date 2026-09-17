import { ChevronDown, Globe2 } from "lucide-react";

import type { CheckoutOption } from "@/features/checkout/model/checkout";

export function CheckoutCountrySelect({
  countries,
  name,
}: Readonly<{ countries: readonly CheckoutOption[]; name: string }>) {
  if (countries.length === 1) {
    return <input name={name} type="hidden" value={countries[0].id} />;
  }

  return (
    <div className="relative sm:col-span-2">
      <label
        className="absolute top-2 left-11 text-[0.65rem] leading-4 text-muted-foreground"
        htmlFor={name}
      >
        Land
      </label>
      <select
        className="h-14 w-full appearance-none rounded-lg border border-border/80 bg-card pt-5 pr-10 pb-1 pl-11 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10 md:text-sm"
        defaultValue=""
        id={name}
        name={name}
        required
      >
        <option disabled value="">
          Bitte wählen
        </option>
        {countries.map((country) => (
          <option key={country.id} value={country.id}>
            {country.label}
          </option>
        ))}
      </select>
      <Globe2
        aria-hidden="true"
        className="pointer-events-none absolute top-5 left-3.5 size-4 text-muted-foreground/70"
        strokeWidth={1.5}
      />
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-5 right-3.5 size-4 text-muted-foreground"
        strokeWidth={1.5}
      />
    </div>
  );
}
