import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { CmsLink } from "@/features/cms/components/cms-link";
import { resolveCmsButtonSize } from "@/features/cms/model/button-size";

const buttonSizeMap = {
  large: "lg",
  medium: "default",
  small: "sm",
} as const;

export type CmsButtonProps = {
  href: string;
  label: string;
  size?: unknown;
  variant?: "default" | "link";
};

export function CmsButton({
  href,
  label,
  size,
  variant = "default",
}: CmsButtonProps) {
  const isLink = variant === "link";

  return (
    <CmsLink
      className={buttonVariants({
        className: isLink
          ? "group px-0 text-white hover:text-primary"
          : "group shadow-lg shadow-black/15 hover:bg-destructive motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[.985]",
        size: buttonSizeMap[resolveCmsButtonSize(size)],
        variant,
      })}
      href={href}
    >
      {label}
      <ArrowRight className="transition-transform motion-safe:group-hover:translate-x-1" />
    </CmsLink>
  );
}
