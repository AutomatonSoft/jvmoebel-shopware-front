import Link from "next/link";

import type { StorefrontBranding } from "@/features/storefront-shell/model/branding";
import { cn } from "@/lib/utils";

export type StoreLogoProps = {
  branding: StorefrontBranding;
  className?: string;
  variant: "footer" | "header";
};

export function StoreLogo({ branding, className, variant }: StoreLogoProps) {
  return (
    <Link
      aria-label={`${branding.name} home`}
      className={cn("inline-flex items-center gap-2", className)}
      href="/"
    >
      {branding.logo ? (
        // The future Shopware media host is intentionally not fixed in Next config yet.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={branding.logo.alt}
          className="max-h-10 max-w-44 object-contain"
          height={branding.logo.height}
          src={branding.logo.url}
          width={branding.logo.width}
        />
      ) : (
        <>
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-full text-xs font-bold tracking-tight",
              variant === "header"
                ? "bg-foreground text-background"
                : "bg-primary text-primary-foreground",
            )}
          >
            JV
          </span>
          <span className="text-sm font-bold tracking-[0.16em]">MOEBEL</span>
        </>
      )}
    </Link>
  );
}
