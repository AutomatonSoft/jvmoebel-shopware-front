import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = HTMLAttributes<HTMLElement> &
  Readonly<{
    aside?: ReactNode;
    description?: ReactNode;
    eyebrow?: ReactNode;
    title: ReactNode;
  }>;

export function PageHeader({
  aside,
  className,
  description,
  eyebrow,
  title,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 border-b border-border/80 pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
        className,
      )}
      {...props}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="flex items-center gap-1.5 text-[0.625rem] font-semibold tracking-[0.13em] text-primary uppercase before:block before:size-1 before:shrink-0 before:bg-primary">
            {eyebrow}
          </p>
        )}
        <h1
          className={cn(
            "text-2xl leading-none font-semibold tracking-[-0.045em] text-balance sm:text-3xl",
            eyebrow && "mt-1.5",
          )}
        >
          {title}
        </h1>
        {description && (
          <div className="mt-1.5 max-w-2xl text-xs leading-5 text-muted-foreground sm:text-[0.8125rem]">
            {description}
          </div>
        )}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </header>
  );
}
