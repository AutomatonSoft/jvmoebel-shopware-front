"use client";

import { ArrowLeft } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function AccountBackButton({
  fallback = "/kundenkonto",
}: Readonly<{ fallback?: Route }>) {
  const router = useRouter();
  return (
    <Button
      className="mb-5 px-0 text-xs hover:bg-transparent hover:underline hover:decoration-primary hover:underline-offset-4"
      onClick={() =>
        window.history.length > 1 ? router.back() : router.push(fallback)
      }
      type="button"
      variant="ghost"
    >
      <ArrowLeft aria-hidden="true" />
      Zurück
    </Button>
  );
}
