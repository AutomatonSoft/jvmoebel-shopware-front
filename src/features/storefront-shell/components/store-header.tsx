import { Heart, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";

import { CategoryMenu } from "@/features/storefront-shell/components/category-menu";
import { HeaderSearch } from "@/features/storefront-shell/components/header-search";
import { MobileHeaderSearch } from "@/features/storefront-shell/components/mobile-header-search";
import { StoreLogo } from "@/features/storefront-shell/components/store-logo";
import type { StorefrontBranding } from "@/features/storefront-shell/model/branding";
import type { MainNavigation } from "@/features/storefront-shell/model/navigation";

export type StoreHeaderProps = {
  branding: StorefrontBranding;
  navigation: MainNavigation;
};

const MAX_VISIBLE_CATEGORIES = 6;

export function StoreHeader({ branding, navigation }: StoreHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="relative mx-auto flex h-18 max-w-360 items-center gap-1 px-4 sm:px-8 lg:gap-6">
        <StoreLogo
          branding={branding}
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 lg:static lg:translate-x-0"
          variant="header"
        />
        {navigation.length > 0 && (
          <nav className="flex items-center gap-6" aria-label="Hauptnavigation">
            <CategoryMenu navigation={navigation} />
            <Link
              className="relative hidden py-7 text-xs font-semibold tracking-wide text-primary transition-colors after:absolute after:inset-x-0 after:bottom-5 after:h-px after:origin-right after:scale-x-0 after:bg-primary after:transition-transform hover:after:origin-left hover:after:scale-x-100 motion-reduce:after:hidden lg:block"
              href="/rabatt-angebote"
            >
              Angebote
            </Link>
            {navigation.slice(0, MAX_VISIBLE_CATEGORIES).map((item) => (
              <a
                className="relative hidden py-7 text-xs font-semibold tracking-wide transition-colors after:absolute after:inset-x-0 after:bottom-5 after:h-px after:origin-right after:scale-x-0 after:bg-primary after:transition-transform hover:text-primary hover:after:origin-left hover:after:scale-x-100 motion-reduce:after:hidden lg:block"
                href={item.href}
                key={item.id}
              >
                {item.label.replace(" & ", "\u00a0& ")}
              </a>
            ))}
          </nav>
        )}
        <HeaderSearch className="ml-auto hidden w-full max-w-80 xl:flex" />
        <MobileHeaderSearch />
        <div className="ml-auto flex items-center justify-end xl:ml-0">
          <Link
            aria-label="Kundenkonto"
            className="hidden min-h-10 items-center gap-2 rounded-full p-1 pr-3 transition-[background,transform,box-shadow] hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:active:translate-y-px motion-safe:active:scale-[.975] xl:flex"
            href="/kundenkonto"
          >
            <span className="flex size-8.5 shrink-0 items-center justify-center rounded-full border border-foreground/15">
              <UserRound className="size-4" />
            </span>
            <span className="flex min-w-12 flex-col leading-none">
              <span className="mb-1 text-[0.5rem] tracking-[0.09em] text-muted-foreground uppercase">
                Kundenkonto
              </span>
              <strong className="text-xs font-semibold">Anmelden</strong>
            </span>
          </Link>
          <div className="flex items-center gap-1 sm:ml-2 sm:border-l sm:border-foreground/10 sm:pl-2">
            <Link
              aria-label="Kundenkonto"
              className="flex size-10 items-center justify-center rounded-full transition-[background,transform,box-shadow,color] hover:bg-muted hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:active:translate-y-px motion-safe:active:scale-90 xl:hidden"
              href="/kundenkonto"
            >
              <UserRound className="size-4.5" />
            </Link>
            <Link
              aria-label="Wunschliste"
              className="hidden size-10 items-center justify-center rounded-full transition-[background,transform,box-shadow,color] hover:bg-muted hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:active:scale-90 sm:flex"
              href="/moebel-sortiment"
            >
              <Heart className="size-4.5" />
            </Link>
            <Link
              aria-label="Warenkorb"
              className="flex size-10 items-center justify-center rounded-full transition-[background,transform,box-shadow,color] hover:bg-muted hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:active:translate-y-px motion-safe:active:scale-90"
              href="/warenkorb"
            >
              <ShoppingBag className="size-4.5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
