import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "header" | "main" | "nav" | "section";
};

export function Container({
  as: Component = "div",
  className,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn("mx-auto w-full max-w-360 px-4 sm:px-8", className)}
      {...props}
    />
  );
}
