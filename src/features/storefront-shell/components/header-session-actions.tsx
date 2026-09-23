import { ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";

import type { CustomerAccountSummary } from "@/features/customer-account/model/account";
import {
  getHeaderCartItemCount,
  getHeaderCustomer,
} from "@/features/storefront-shell/server/header-session";

function HeaderAccountLinks({
  customer,
  loading = false,
}: Readonly<{
  customer: CustomerAccountSummary | null;
  loading?: boolean;
}>) {
  const accountHref =
    customer || loading ? "/kundenkonto" : "/kundenkonto/anmelden";
  const accountLabel = loading
    ? "Kundenkonto"
    : customer
      ? `${customer.firstName} ${customer.lastName}`.trim()
      : "Anmelden";
  const accountAriaLabel = customer
    ? `Kundenkonto von ${accountLabel}`
    : loading
      ? "Kundenkonto"
      : "Anmelden";

  return (
    <>
      <Link
        aria-label={accountAriaLabel}
        className="hidden min-h-10 items-center gap-2 rounded-full p-1 pr-3 transition-[background,transform,box-shadow] hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:active:translate-y-px motion-safe:active:scale-[.975] xl:flex"
        href={accountHref}
      >
        <span className="flex size-8.5 shrink-0 items-center justify-center rounded-full border border-foreground/15">
          <UserRound className="size-4" />
        </span>
        <span className="flex min-w-12 flex-col leading-none">
          <span className="mb-1 text-[0.5rem] tracking-[0.09em] text-muted-foreground uppercase">
            Profil
          </span>
          <strong className="max-w-28 truncate text-xs font-semibold">
            {accountLabel}
          </strong>
        </span>
      </Link>
      <Link
        aria-label={accountAriaLabel}
        className="flex size-10 items-center justify-center rounded-full transition-[background,transform,box-shadow,color] hover:bg-muted hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:active:translate-y-px motion-safe:active:scale-90 xl:hidden"
        href={accountHref}
      >
        <UserRound className="size-4.5" />
      </Link>
    </>
  );
}

function HeaderCartLink({
  cartItemCount,
}: Readonly<{ cartItemCount: number }>) {
  return (
    <Link
      aria-label={
        cartItemCount > 0 ? `Warenkorb, ${cartItemCount} Artikel` : "Warenkorb"
      }
      className="relative flex size-10 items-center justify-center rounded-full transition-[background,transform,box-shadow,color] hover:bg-muted hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:active:translate-y-px motion-safe:active:scale-90"
      href="/warenkorb"
    >
      <ShoppingBag className="size-4.5" />
      {cartItemCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[0.5625rem] leading-4 font-bold text-primary-foreground"
        >
          {cartItemCount > 99 ? "99+" : cartItemCount}
        </span>
      )}
    </Link>
  );
}

export async function HeaderAccountActions() {
  const customer = await getHeaderCustomer();

  return <HeaderAccountLinks customer={customer} />;
}

export function HeaderAccountActionsFallback() {
  return <HeaderAccountLinks customer={null} loading />;
}

export async function HeaderCartAction() {
  const cartItemCount = await getHeaderCartItemCount();

  return <HeaderCartLink cartItemCount={cartItemCount} />;
}

export function HeaderCartActionFallback() {
  return <HeaderCartLink cartItemCount={0} />;
}
