"use client";

import { CircleCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

type AccountSuccessToastProps = Readonly<{
  description: string;
  title: string;
}>;

export function AccountSuccessToast({
  description,
  title,
}: AccountSuccessToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 5000);

    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className="animate-in fade-in slide-in-from-bottom-3 fixed right-4 bottom-4 z-100 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 overflow-hidden rounded-xl border border-foreground/10 bg-card p-4 pr-12 shadow-[0_20px_60px_-24px_rgba(21,21,19,0.5)] duration-300 sm:right-6 sm:bottom-6"
      role="status"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1 bg-primary"
      />
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
        <CircleCheck aria-hidden="true" className="size-5" strokeWidth={1.8} />
      </span>
      <span className="min-w-0 pt-0.5">
        <strong className="block text-sm font-semibold">{title}</strong>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
          {description}
        </span>
      </span>
      <button
        aria-label="Benachrichtigung schließen"
        className="absolute top-2 right-2 grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={() => setVisible(false)}
        type="button"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
