"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ArrowRight, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type {
  MainNavigation,
  StoreNavigationItem,
} from "@/features/storefront-shell/model/navigation";

export type CategoryMenuProps = {
  navigation: MainNavigation;
};

function getChildrenLabel(count: number) {
  return `${count} ${count === 1 ? "Unterkategorie" : "Unterkategorien"}`;
}

function CategoryItemContent({ item }: { item: StoreNavigationItem }) {
  const hasChildren = item.children.length > 0;

  return (
    <>
      <span className="min-w-0 text-left">
        <span className="block font-semibold wrap-break-word">
          {item.label}
        </span>
        <span className="mt-1 block text-xs font-normal text-muted-foreground">
          {hasChildren
            ? getChildrenLabel(item.children.length)
            : "Kategorie öffnen"}
        </span>
      </span>
      {hasChildren ? (
        <ChevronRight className="size-4.5 shrink-0 text-muted-foreground transition-transform group-hover/category-item:translate-x-0.5 group-hover/category-item:text-primary" />
      ) : (
        <ArrowRight className="size-4.5 shrink-0 text-muted-foreground transition-transform group-hover/category-item:translate-x-0.5 group-hover/category-item:text-primary" />
      )}
    </>
  );
}

function CategoryItem({
  item,
  onSelect,
}: {
  item: StoreNavigationItem;
  onSelect: (item: StoreNavigationItem) => void;
}) {
  const className =
    "group/category-item flex min-h-20 w-full items-center justify-between gap-4 rounded-xl border bg-card/60 px-4 py-3 text-foreground transition-[background,border-color,box-shadow,transform] hover:border-primary/35 hover:bg-primary/5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:active:scale-[.99]";

  if (item.children.length > 0) {
    return (
      <button
        className={className}
        onClick={() => onSelect(item)}
        type="button"
      >
        <CategoryItemContent item={item} />
      </button>
    );
  }

  return (
    <Dialog.Close
      className={className}
      nativeButton={false}
      render={<a href={item.href} />}
    >
      <CategoryItemContent item={item} />
    </Dialog.Close>
  );
}

export function CategoryMenu({ navigation }: CategoryMenuProps) {
  const [categoryPath, setCategoryPath] = useState<StoreNavigationItem[]>([]);
  const currentCategory = categoryPath.at(-1);
  const currentItems = currentCategory?.children ?? navigation;

  function openCategory(item: StoreNavigationItem) {
    setCategoryPath((path) => [...path, item]);
  }

  function goBack() {
    setCategoryPath((path) => path.slice(0, -1));
  }

  function goToPathDepth(depth: number) {
    setCategoryPath((path) => path.slice(0, depth));
  }

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (open) {
          setCategoryPath([]);
        }
      }}
    >
      <Dialog.Trigger
        aria-label="Kategorien öffnen"
        className="relative flex h-18 shrink-0 cursor-pointer items-center gap-2 bg-transparent px-0 text-xs font-semibold tracking-wide transition-colors after:absolute after:inset-x-0 after:bottom-5 after:hidden after:h-0.5 after:bg-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none lg:py-7 lg:after:block"
      >
        <Menu className="size-5 lg:hidden" aria-hidden="true" />
        <span className="hidden lg:inline">Kategorien</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-60 min-h-dvh bg-foreground/45 backdrop-blur-xs transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
        <Dialog.Viewport className="fixed inset-0 z-70 flex min-h-dvh items-center justify-center overflow-y-auto p-3 sm:p-8">
          <Dialog.Popup className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl transition-[transform,opacity] duration-200 ease-out data-ending-style:scale-[.98] data-ending-style:opacity-0 data-starting-style:scale-[.98] data-starting-style:opacity-0 sm:max-h-[calc(100dvh-4rem)]">
            <div className="flex shrink-0 items-start justify-between gap-4 border-b px-4 py-4 sm:px-7 sm:py-6">
              <div className="flex min-w-0 items-start gap-2 sm:gap-3">
                {currentCategory && (
                  <Button
                    aria-label="Zurück zu den vorherigen Kategorien"
                    className="mt-0.5 rounded-full"
                    onClick={goBack}
                    size="icon-lg"
                    type="button"
                    variant="ghost"
                  >
                    <ChevronLeft className="size-5" />
                  </Button>
                )}
                <div className="min-w-0">
                  <Dialog.Title className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
                    {currentCategory?.label ?? "Alle Kategorien"}
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                    {currentCategory
                      ? getChildrenLabel(currentItems.length)
                      : "Wählen Sie eine Kollektion, um ihre Unterkategorien zu entdecken."}
                  </Dialog.Description>
                </div>
              </div>

              <Dialog.Close
                aria-label="Kategorien schließen"
                render={
                  <Button
                    className="shrink-0 rounded-full"
                    size="icon-lg"
                    type="button"
                    variant="ghost"
                  />
                }
              >
                <X className="size-5" />
              </Dialog.Close>
            </div>

            <div className="min-h-0 overflow-y-auto px-4 py-4 sm:px-7 sm:py-6">
              <nav
                aria-label="Kategoriepfad"
                className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground sm:mb-5"
              >
                <Button
                  className="h-8 px-2 text-xs"
                  onClick={() => goToPathDepth(0)}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  Alle Kategorien
                </Button>
                {categoryPath.map((item, index) => (
                  <span className="flex items-center gap-1" key={item.id}>
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                    {index === categoryPath.length - 1 ? (
                      <span className="max-w-48 truncate px-2 font-medium text-foreground">
                        {item.label}
                      </span>
                    ) : (
                      <Button
                        className="h-8 max-w-48 px-2 text-xs"
                        onClick={() => goToPathDepth(index + 1)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        <span className="truncate">{item.label}</span>
                      </Button>
                    )}
                  </span>
                ))}
              </nav>

              {currentCategory && (
                <Dialog.Close
                  className="mb-4 flex min-h-12 w-full items-center justify-between gap-4 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-[background,transform] hover:bg-destructive focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:active:scale-[.99] sm:mb-5"
                  nativeButton={false}
                  render={<a href={currentCategory.href} />}
                >
                  <span>Alle Artikel in {currentCategory.label} ansehen</span>
                  <ArrowRight
                    className="size-4.5 shrink-0"
                    aria-hidden="true"
                  />
                </Dialog.Close>
              )}

              <div
                className="grid gap-2.5 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-2 motion-safe:duration-200 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3"
                key={currentCategory?.id ?? "all-categories"}
              >
                {currentItems.map((item) => (
                  <CategoryItem
                    item={item}
                    key={item.id}
                    onSelect={openCategory}
                  />
                ))}
              </div>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
