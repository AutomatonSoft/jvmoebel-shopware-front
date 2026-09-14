"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import type {
  MainNavigation,
  StoreNavigationItem,
} from "@/features/storefront-shell/model/navigation";
import { loadCategoryChildren } from "@/features/storefront-shell/server/load-category-children";

export function useCategoryMenu(navigation: MainNavigation) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [categoryPath, setCategoryPath] = useState<StoreNavigationItem[]>([]);
  const [loadedChildren, setLoadedChildren] = useState<
    Record<string, StoreNavigationItem[]>
  >({});
  const [loadingCategoryId, setLoadingCategoryId] = useState<string>();
  const [loadError, setLoadError] = useState(false);
  const loadRequestId = useRef(0);
  const currentCategory = categoryPath.at(-1);
  const currentItems = currentCategory?.children ?? navigation;

  function cancelPendingLoad() {
    loadRequestId.current += 1;
    setLoadingCategoryId(undefined);
    setLoadError(false);
  }

  function navigateToCategory(item: StoreNavigationItem) {
    setIsOpen(false);

    if (item.href.startsWith("/") && !item.href.startsWith("//")) {
      router.push(item.href as Route);
      return;
    }

    window.location.assign(item.href);
  }

  async function openCategory(item: StoreNavigationItem) {
    const requestId = ++loadRequestId.current;
    const hasCachedChildren = Object.prototype.hasOwnProperty.call(
      loadedChildren,
      item.id,
    );
    const children = hasCachedChildren
      ? loadedChildren[item.id]
      : item.children;

    setLoadError(false);

    if (children.length > 0) {
      setCategoryPath((path) => [
        ...path,
        { ...item, childCount: children.length, children },
      ]);
      return;
    }

    if (hasCachedChildren) {
      navigateToCategory(item);
      return;
    }

    setLoadingCategoryId(item.id);
    const result = await loadCategoryChildren(item.id);

    if (loadRequestId.current !== requestId) {
      return;
    }

    setLoadingCategoryId(undefined);

    if (result.status === "error") {
      setLoadError(true);
      return;
    }

    setLoadedChildren((loaded) => ({
      ...loaded,
      [item.id]: result.items,
    }));

    if (result.items.length === 0) {
      navigateToCategory(item);
      return;
    }

    setCategoryPath((path) => [
      ...path,
      { ...item, childCount: result.items.length, children: result.items },
    ]);
  }

  function goBack() {
    cancelPendingLoad();
    setCategoryPath((path) => path.slice(0, -1));
  }

  function goToPathDepth(depth: number) {
    cancelPendingLoad();
    setCategoryPath((path) => path.slice(0, depth));
  }

  function handleOpenChange(open: boolean) {
    cancelPendingLoad();
    setIsOpen(open);

    if (open) {
      setCategoryPath([]);
    }
  }

  return {
    categoryPath,
    currentCategory,
    currentItems,
    goBack,
    goToPathDepth,
    handleOpenChange,
    isOpen,
    loadError,
    loadingCategoryId,
    openCategory,
  };
}
