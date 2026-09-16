import Link from "next/link";

import type { StorefrontBranding } from "@/features/storefront-shell/model/branding";
import { cn } from "@/lib/utils";

export type StoreLogoProps = {
  branding: StorefrontBranding;
  className?: string;
  variant: "footer" | "header";
};

export function StoreLogo({ branding, className, variant }: StoreLogoProps) {
  const dimensions =
    variant === "header"
      ? { className: "size-18", height: 32, width: 32 }
      : { className: "size-20", height: 40, width: 40 };

  return (
    <Link
      aria-label={`${branding.name} Startseite`}
      className={cn(
        "inline-flex shrink-0 items-center gap-2",
        branding.logo ? dimensions.className : "w-fit",
        className,
      )}
      href="/"
    >
      {branding.logo ? (
        // The future Shopware media host is intentionally not fixed in Next config yet.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={branding.logo.alt}
          className="size-full object-cover mix-blend-multiply"
          height={dimensions.height}
          src={branding.logo.url}
          width={dimensions.width}
        />
      ) : (
        <>
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full text-xs font-bold tracking-tight",
              variant === "header"
                ? "size-8 bg-foreground text-background"
                : "size-10 bg-primary text-primary-foreground",
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
