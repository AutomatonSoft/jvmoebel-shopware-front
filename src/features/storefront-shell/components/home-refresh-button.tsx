"use client";

import { useRouter } from "next/navigation";

import { ArrowRight } from "lucide-react";

export function HomeRefreshButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.refresh()}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white/70 px-6 text-sm font-semibold text-foreground backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      Erneut prüfen
      <ArrowRight className="size-4" />
    </button>
  );
}
