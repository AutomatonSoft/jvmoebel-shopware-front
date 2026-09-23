import type { Route } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Container } from "@/components/ui/container";
import { CategoryMenu } from "@/features/storefront-shell/components/category-menu";
import { HeaderSearch } from "@/features/storefront-shell/components/header-search";
import {
  HeaderSessionActions,
  HeaderSessionActionsFallback,
} from "@/features/storefront-shell/components/header-session-actions";
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
      <Container className="relative flex h-18 items-center gap-1 lg:gap-6">
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
              <Link
                className="relative hidden py-7 text-xs font-semibold tracking-wide transition-colors after:absolute after:inset-x-0 after:bottom-5 after:h-px after:origin-right after:scale-x-0 after:bg-primary after:transition-transform hover:text-primary hover:after:origin-left hover:after:scale-x-100 motion-reduce:after:hidden lg:block"
                href={item.href as Route}
                key={item.id}
              >
                {item.label.replace(" & ", "\u00a0& ")}
              </Link>
            ))}
          </nav>
        )}
        <HeaderSearch className="ml-auto hidden w-full max-w-80 xl:flex" />
        <MobileHeaderSearch />
        <Suspense fallback={<HeaderSessionActionsFallback />}>
          <HeaderSessionActions />
        </Suspense>
      </Container>
    </header>
  );
}
