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
        "flex flex-col gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:pb-6",
        className,
      )}
      {...props}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.15em] text-primary uppercase before:block before:size-1.5 before:shrink-0 before:bg-primary">
            {eyebrow}
          </p>
        )}
        <h1
          className={cn(
            "text-3xl leading-none font-semibold tracking-[-0.045em] text-balance sm:text-4xl",
            eyebrow && "mt-2.5",
          )}
        >
          {title}
        </h1>
        {description && (
          <div className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </div>
        )}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </header>
  );
}
