"use client";

import { ArrowLeft } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function AccountBackButton({
  alwaysUseFallback = false,
  fallback = "/kundenkonto",
}: Readonly<{ alwaysUseFallback?: boolean; fallback?: Route }>) {
  const router = useRouter();
  return (
    <Button
      className="mb-5 px-0 text-xs hover:bg-transparent hover:underline hover:decoration-primary hover:underline-offset-4"
      onClick={() =>
        alwaysUseFallback || window.history.length <= 1
          ? router.push(fallback)
          : router.back()
      }
      type="button"
      variant="ghost"
    >
      <ArrowLeft aria-hidden="true" />
      Zurück
    </Button>
  );
}
