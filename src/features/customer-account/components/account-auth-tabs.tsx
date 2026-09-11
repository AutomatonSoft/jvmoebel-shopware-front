"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

const tabs = [
  { href: "/kundenkonto/registrieren", label: "Registrieren" },
  { href: "/kundenkonto/anmelden", label: "Anmelden" },
] as const;

export function AccountAuthTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("weiter");

  return (
    <nav
      aria-label="Anmeldung und Registrierung"
      className="mb-5 grid grid-cols-2 border-b border-border"
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href;

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px flex min-h-11 items-center justify-center border-b-2 px-3 text-sm font-medium transition-colors focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
            )}
            href={
              redirectTo
                ? { pathname: tab.href, query: { weiter: redirectTo } }
                : tab.href
            }
            key={tab.href}
            scroll={false}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
