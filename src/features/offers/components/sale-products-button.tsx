"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type SaleProductsButtonProps = Readonly<{
  className?: string;
}>;

export function SaleProductsButton({ className }: SaleProductsButtonProps) {
  const scrollToProducts = () => {
    const productSection = document.getElementById("sale-products");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    productSection?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <Button
      className={className}
      onClick={scrollToProducts}
      size="lg"
      type="button"
    >
      Sale entdecken
      <ArrowRight className="size-4" />
    </Button>
  );
}
