"use client";

import { useEffect, useState } from "react";

import {
  formatCountdownLabel,
  getCountdownParts,
} from "@/features/offers/model/countdown";

const countdownUnits = [
  ["days", "Tage"],
  ["hours", "Std."],
  ["minutes", "Min."],
  ["seconds", "Sek."],
] as const;

export function CountdownPromoTimer({ endsAt }: { endsAt: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    function updateNow() {
      setNow(Date.now());
    }

    updateNow();
    const timer = window.setInterval(updateNow, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const parts = now === null ? null : getCountdownParts(endsAt, now);

  if (now !== null && !parts) {
    return <p className="text-sm font-semibold">Aktion beendet</p>;
  }

  return (
    <time
      aria-label={parts ? formatCountdownLabel(parts) : "Restzeit wird geladen"}
      className="grid grid-cols-4 gap-2"
      dateTime={endsAt}
      role="timer"
    >
      {countdownUnits.map(([key, label]) => (
        <span
          className="flex min-w-16 flex-col rounded-xl bg-card/85 px-3 py-2 text-center shadow-sm backdrop-blur-sm"
          key={key}
        >
          <strong className="text-xl font-semibold tabular-nums sm:text-2xl">
            {parts ? String(parts[key]).padStart(2, "0") : "00"}
          </strong>
          <span className="text-[0.625rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {label}
          </span>
        </span>
      ))}
    </time>
  );
}
