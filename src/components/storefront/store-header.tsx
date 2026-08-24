import {
  ArrowRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";

import type { MainNavigation } from "@/lib/shopware/navigation";

export type StoreHeaderProps = {
  navigation: MainNavigation;
};

function StoreSearchForm({ className }: { className: string }) {
  return (
    <form
      action="/shop"
      className={`h-11 items-center rounded-full border bg-muted/80 p-1 pl-4 transition-[background,border-color,box-shadow] hover:border-foreground/15 hover:bg-card/70 focus-within:border-foreground/25 focus-within:bg-card focus-within:ring-3 focus-within:ring-primary/15 ${className}`}
      role="search"
    >
      <Search className="mr-2 size-4.5 shrink-0 text-muted-foreground transition-colors group-focus-within/search:text-foreground" />
      <input
        aria-label="Search products"
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        name="query"
        placeholder="Search furniture"
        type="search"
      />
      <button
        aria-label="Submit search"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-[background,transform,box-shadow] hover:bg-destructive motion-safe:hover:translate-x-px motion-safe:active:translate-y-px motion-safe:active:scale-90"
        type="submit"
      >
        <ArrowRight className="size-4" />
      </button>
    </form>
  );
}

export function StoreHeader({ navigation }: StoreHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="relative mx-auto flex h-18 max-w-360 items-center gap-6 px-4 sm:px-8">
        {navigation.length > 0 && (
          <details className="group static lg:hidden" name="header-panel">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg transition-colors hover:bg-muted motion-safe:transition-transform motion-safe:active:scale-95 [&::-webkit-details-marker]:hidden">
              <Menu className="size-5 group-open:hidden" />
              <X className="hidden size-5 group-open:block" />
              <span className="sr-only">Toggle navigation</span>
            </summary>
            <nav className="absolute inset-x-0 top-full grid origin-top gap-1 border-b bg-background p-4 shadow-lg motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 motion-safe:duration-200">
              {navigation.map((item) => (
                <a
                  className="rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary"
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
                className="relative py-7 text-xs font-semibold tracking-wide transition-colors after:absolute after:inset-x-0 after:bottom-5 after:h-px after:origin-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 hover:text-primary hover:after:origin-left hover:after:scale-x-100 motion-reduce:after:hidden"
                href={item.href}
                key={item.id}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <StoreSearchForm className="group/search ml-auto hidden w-full max-w-80 xl:flex" />

        <details className="group static ml-auto xl:hidden" name="header-panel">
          <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg transition-colors hover:bg-muted motion-safe:transition-transform motion-safe:active:scale-95 [&::-webkit-details-marker]:hidden">
            <Search className="size-4.5 group-open:hidden" />
            <X className="hidden size-4.5 group-open:block" />
            <span className="sr-only">Toggle search</span>
          </summary>
          <StoreSearchForm className="group/search absolute inset-x-3 top-[calc(100%+0.5rem)] z-10 flex h-14 shadow-xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 motion-safe:duration-200 sm:inset-x-8" />
        </details>

        <div className="flex items-center justify-end">
          <a
            aria-label="Account"
            className="hidden min-h-10 items-center gap-2 rounded-full p-1 pr-3 transition-[background,transform,box-shadow] hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:active:translate-y-px motion-safe:active:scale-[.975] xl:flex"
            href="/account"
          >
            <span className="flex size-8.5 shrink-0 items-center justify-center rounded-full border border-foreground/15">
              <UserRound className="size-4" />
            </span>
            <span className="flex min-w-12 flex-col leading-none">
              <span className="mb-1 text-[0.5rem] tracking-[0.09em] text-muted-foreground uppercase">
                Account
              </span>
              <strong className="text-xs font-semibold">Sign in</strong>
            </span>
          </a>

          <div className="flex items-center gap-1 sm:ml-2 sm:border-l sm:border-foreground/10 sm:pl-2">
            <a
              aria-label="Wishlist"
              className="hidden size-10 items-center justify-center rounded-full transition-[background,transform,box-shadow,color] hover:bg-muted hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:active:translate-y-px motion-safe:active:scale-90 sm:flex"
              href="/shop"
            >
              <Heart className="size-4.5" />
            </a>
            <a
              aria-label="Shopping bag"
              className="flex size-10 items-center justify-center rounded-full transition-[background,transform,box-shadow,color] hover:bg-muted hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:active:translate-y-px motion-safe:active:scale-90"
              href="/cart"
            >
              <ShoppingBag className="size-4.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
