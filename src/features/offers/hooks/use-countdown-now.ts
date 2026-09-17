"use client";

import { useEffect, useState } from "react";

import { getNextCountdownTickDelay } from "@/features/offers/model/countdown";

export function useCountdownNow(endsAt: string) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let timer: number | undefined;

    function updateNow() {
      const currentNow = Date.now();

      setNow(currentNow);

      const delay = getNextCountdownTickDelay(endsAt, currentNow);

      if (delay === null) {
        return;
      }

      timer = window.setTimeout(updateNow, delay);
    }

    timer = window.setTimeout(updateNow, 0);

    return () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, [endsAt]);

  return now;
}
