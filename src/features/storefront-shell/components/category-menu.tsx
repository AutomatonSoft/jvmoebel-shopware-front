"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
  ArrowRight,
  BadgePercent,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useCategoryMenu } from "@/features/storefront-shell/hooks/use-category-menu";
import type {
  MainNavigation,
  StoreNavigationItem,
} from "@/features/storefront-shell/model/navigation";

export type CategoryMenuProps = { navigation: MainNavigation };

function getChildrenLabel(count: number) {
  return `${count} ${count === 1 ? "Unterkategorie" : "Unterkategorien"}`;
}

function getChildCount(item: StoreNavigationItem) {
  return Math.max(item.childCount ?? 0, item.children.length);
}

function CategoryItemContent({
  item,
  loading,
}: {
  item: StoreNavigationItem;
  loading: boolean;
}) {
  const childCount = getChildCount(item);
  const hasChildren = childCount > 0;

  return (
    <>
      <span className="min-w-0 text-left">
        <span className="block text-sm font-medium tracking-[-0.01em] wrap-break-word sm:text-[0.9375rem]">
          {item.label}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2.5">
        {!loading && hasChildren && (
          <span className="min-w-6 rounded-full bg-secondary px-2 py-1 text-center text-[0.625rem] font-semibold tabular-nums text-muted-foreground">
            {childCount}
          </span>
        )}
        <span className="grid size-8 place-items-center rounded-full bg-secondary text-muted-foreground transition-[background,color,transform] group-hover/category-item:bg-primary group-hover/category-item:text-primary-foreground group-hover/category-item:translate-x-0.5">
          {loading ? (
            <LoaderCircle className="size-3.5 animate-spin" />
          ) : hasChildren ? (
            <ChevronRight className="size-3.5" />
          ) : (
            <ArrowRight className="size-3.5" />
          )}
        </span>
      </span>
    </>
  );
}

function CategoryItem({
  item,
  loading,
  onSelect,
}: {
  item: StoreNavigationItem;
  loading: boolean;
  onSelect: (item: StoreNavigationItem) => Promise<void>;
}) {
  const className =
    "group/category-item flex min-h-14 w-full items-center justify-between gap-4 rounded-xl border border-transparent px-3 py-2.5 text-foreground transition-[background,border-color,box-shadow,transform] hover:border-border hover:bg-card hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:active:scale-[.99]";

  if (getChildCount(item) > 0 && item.type !== "link") {
    return (
      <button
        aria-busy={loading || undefined}
        className={className}
        disabled={loading}
        onClick={() => void onSelect(item)}
        type="button"
      >
        <CategoryItemContent item={item} loading={loading} />
      </button>
    );
  }

  return (
    <a className={className} href={item.href}>
      <CategoryItemContent item={item} loading={false} />
    </a>
  );
}

function ViewAllCategoryItem({ item }: { item: StoreNavigationItem }) {
  return (
    <a
      className="group/category-item flex min-h-14 w-full items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-foreground transition-[background,border-color,box-shadow,transform] hover:border-primary/40 hover:bg-primary/10 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:active:scale-[.99]"
      href={item.href}
    >
      <span className="text-left text-sm font-semibold sm:text-[0.9375rem]">
        Alle {item.label}
      </span>
      <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover/category-item:translate-x-0.5">
        <ArrowRight className="size-3.5" />
      </span>
    </a>
  );
}

function OffersMenuItem() {
  return (
    <Dialog.Close
      nativeButton={false}
      render={
        <Link
          className="group/category-item flex min-h-14 w-full items-center justify-between gap-4 rounded-xl border border-primary/25 bg-primary/8 px-3 py-2.5 text-foreground transition-[background,border-color,box-shadow,transform] hover:border-primary/45 hover:bg-primary/12 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:active:scale-[.99]"
          href="/rabatt-angebote"
        />
      }
    >
      <span className="flex min-w-0 items-center gap-3 text-left">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <BadgePercent aria-hidden="true" className="size-4" />
        </span>
        <span className="text-sm font-semibold sm:text-[0.9375rem]">
          Angebote
        </span>
      </span>
      <ArrowRight className="size-4 text-primary transition-transform group-hover/category-item:translate-x-0.5" />
    </Dialog.Close>
  );
}

export function CategoryMenu({ navigation }: CategoryMenuProps) {
  const {
    categoryPath,
    currentCategory,
    currentItems,
    goBack,
    goToPathDepth,
    handleOpenChange,
    loadError,
    loadingCategoryId,
    openCategory,
  } = useCategoryMenu(navigation);

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger
        aria-label="Kategorien öffnen"
        className="relative flex h-18 shrink-0 cursor-pointer items-center gap-2 bg-transparent px-0 text-xs font-semibold tracking-wide transition-colors after:absolute after:inset-x-0 after:bottom-5 after:hidden after:h-0.5 after:bg-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none lg:py-7 lg:after:block"
      >
        <Menu className="size-5 lg:hidden" aria-hidden="true" />
        <span className="hidden lg:inline">Kategorien</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-60 min-h-dvh bg-foreground/30 backdrop-blur-[2px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
        <Dialog.Viewport className="fixed inset-0 z-70 flex min-h-dvh items-center justify-center overflow-y-auto p-2 sm:p-6">
          <Dialog.Popup className="relative flex h-[min(44rem,calc(100dvh-1rem))] w-full max-w-4xl flex-col overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-background shadow-[0_32px_100px_-32px_rgba(21,21,19,0.45)] transition-[transform,opacity] duration-200 ease-out data-ending-style:translate-y-2 data-ending-style:scale-[.99] data-ending-style:opacity-0 data-starting-style:translate-y-2 data-starting-style:scale-[.99] data-starting-style:opacity-0 sm:h-[min(42rem,calc(100dvh-3rem))] sm:rounded-[1.75rem]">
            <div className="flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-foreground/10 px-4 py-2 sm:min-h-18 sm:px-6 sm:py-3">
              <div className="min-w-0">
                <Dialog.Title className="text-lg font-semibold tracking-[-0.025em]">
                  Kategorien
                </Dialog.Title>
                <Dialog.Description className="sr-only">
                  Produktkategorien durchsuchen.
                </Dialog.Description>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden text-[0.625rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase sm:inline">
                  {navigation.length} Kategorien
                </span>
                <Dialog.Close
                  aria-label="Kategorien schließen"
                  render={
                    <Button
                      className="rounded-full border border-transparent hover:border-border hover:bg-secondary"
                      size="icon-lg"
                      type="button"
                      variant="ghost"
                    />
                  }
                >
                  <X className="size-4.5" />
                </Dialog.Close>
              </div>
            </div>
            <div className="grid min-h-0 flex-1 lg:grid-cols-[15rem_minmax(0,1fr)]">
              <aside className="relative shrink-0 overflow-hidden border-b border-border bg-secondary/70 px-4 py-3 text-foreground sm:px-5 sm:py-5 lg:border-r lg:border-b-0 lg:px-6 lg:py-7">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -bottom-20 size-48 rounded-full bg-accent/55 blur-3xl"
                />
                <div className="relative">
                  {currentCategory && (
                    <button
                      className="-ml-2 mb-3 inline-flex h-7 items-center gap-1.5 rounded-full px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-background/80 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary sm:mb-6 sm:h-8"
                      onClick={goBack}
                      type="button"
                    >
                      <ChevronLeft className="size-3.5" />
                      Zurück
                    </button>
                  )}
                  <p className="mb-1 text-[0.625rem] font-semibold tracking-[0.16em] text-primary uppercase sm:mb-2">
                    {currentCategory
                      ? "Aktuelle Kategorie"
                      : "Katalogübersicht"}
                  </p>
                  <h2 className="text-lg leading-tight font-semibold tracking-[-0.035em] text-balance sm:text-2xl">
                    {currentCategory?.label ?? "Kollektion entdecken"}
                  </h2>
                  {currentCategory && (
                    <p className="mt-1.5 max-w-xs text-xs leading-5 text-muted-foreground sm:mt-3 sm:text-sm sm:leading-6">
                      {getChildrenLabel(currentItems.length)}
                    </p>
                  )}
                </div>
              </aside>
              <div className="flex min-h-0 min-w-0 flex-col">
                <nav
                  aria-label="Kategoriepfad"
                  className="flex min-h-11 shrink-0 items-center gap-1 overflow-x-auto border-b border-foreground/10 px-4 text-[0.6875rem] text-muted-foreground scrollbar-width:none sm:px-5 [&::-webkit-scrollbar]:hidden"
                >
                  <button
                    className="shrink-0 rounded-md px-1.5 py-1 font-medium transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() => goToPathDepth(0)}
                    type="button"
                  >
                    Alle Kategorien
                  </button>
                  {categoryPath.map((item, index) => (
                    <span
                      className="flex shrink-0 items-center gap-1"
                      key={item.id}
                    >
                      <ChevronRight className="size-3 text-border" />
                      {index === categoryPath.length - 1 ? (
                        <span className="max-w-40 truncate px-1.5 py-1 font-medium text-foreground">
                          {item.label}
                        </span>
                      ) : (
                        <button
                          className="max-w-40 truncate rounded-md px-1.5 py-1 transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                          onClick={() => goToPathDepth(index + 1)}
                          type="button"
                        >
                          {item.label}
                        </button>
                      )}
                    </span>
                  ))}
                </nav>
                <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
                  {loadError && (
                    <p
                      className="mb-3 rounded-xl border border-destructive/25 bg-destructive/5 px-3.5 py-3 text-xs text-destructive"
                      role="alert"
                    >
                      Unterkategorien konnten nicht geladen werden. Bitte
                      versuche es erneut.
                    </p>
                  )}
                  <div
                    className="grid gap-1 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-1 motion-safe:duration-200 sm:grid-cols-2"
                    key={currentCategory?.id ?? "all-categories"}
                  >
                    {!currentCategory && <OffersMenuItem />}
                    {currentCategory && currentCategory.type !== "folder" && (
                      <ViewAllCategoryItem item={currentCategory} />
                    )}
                    {currentItems.map((item) => (
                      <CategoryItem
                        item={item}
                        key={item.id}
                        loading={loadingCategoryId === item.id}
                        onSelect={openCategory}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
