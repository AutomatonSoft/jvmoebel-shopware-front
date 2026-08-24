import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";

import type { MainNavigation } from "@/lib/shopware/navigation";

export type StoreHeaderProps = {
  navigation: MainNavigation;
};

export function StoreHeader({ navigation }: StoreHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="relative mx-auto flex h-18 max-w-360 items-center gap-6 px-4 sm:px-8">
        {navigation.length > 0 && (
          <details className="group static lg:hidden">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg hover:bg-muted [&::-webkit-details-marker]:hidden">
              <Menu className="size-5 group-open:hidden" />
              <X className="hidden size-5 group-open:block" />
              <span className="sr-only">Toggle navigation</span>
            </summary>
            <nav className="absolute inset-x-0 top-full grid gap-1 border-b bg-background p-4 shadow-lg">
              {navigation.map((item) => (
                <a
                  className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted"
                  href={item.href}
                  key={item.id}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </details>
        )}

        <Link
          aria-label="JVMöbel home"
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 lg:static lg:translate-x-0"
          href="/"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-xs font-bold tracking-tight text-background">
            JV
          </span>
          <span className="text-sm font-bold tracking-[0.16em]">MOEBEL</span>
        </Link>

        {navigation.length > 0 && (
          <nav className="hidden items-center gap-6 lg:flex">
            {navigation.map((item) => (
              <a
                className="text-xs font-semibold tracking-wide hover:text-muted-foreground"
                href={item.href}
                key={item.id}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-1">
          <a
            aria-label="Search"
            className="hidden size-10 items-center justify-center rounded-lg hover:bg-muted sm:flex"
            href="/shop"
          >
            <Search className="size-4.5" />
          </a>
          <a
            aria-label="Account"
            className="hidden size-10 items-center justify-center rounded-lg hover:bg-muted md:flex"
            href="/account"
          >
            <UserRound className="size-4.5" />
          </a>
          <a
            aria-label="Wishlist"
            className="hidden size-10 items-center justify-center rounded-lg hover:bg-muted md:flex"
            href="/shop"
          >
            <Heart className="size-4.5" />
          </a>
          <a
            aria-label="Shopping bag"
            className="flex size-10 items-center justify-center rounded-lg hover:bg-muted"
            href="/cart"
          >
            <ShoppingBag className="size-4.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
