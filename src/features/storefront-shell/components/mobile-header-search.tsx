"use client";

import { ArrowRight, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchResults } from "@/features/search/components/search-results";
import { useProductSearch } from "@/features/search/hooks/use-product-search";

const MOBILE_SEARCH_PANEL_ID = "mobile-header-search-panel";

export function MobileHeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const search = useProductSearch(query, isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      setIsOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div className="static xl:hidden" ref={rootRef}>
      <button
        aria-controls={MOBILE_SEARCH_PANEL_ID}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close search" : "Open search"}
        className="flex size-10 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:transition-transform motion-safe:active:scale-95"
        onClick={() => setIsOpen((open) => !open)}
        ref={triggerRef}
        type="button"
      >
        {isOpen ? (
          <X className="size-4.5" aria-hidden="true" />
        ) : (
          <Search className="size-4.5" aria-hidden="true" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-1/2 top-[calc(100%+0.5rem)] z-10 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 overflow-hidden rounded-2xl border bg-background shadow-xl sm:max-w-130"
            exit={{ opacity: 0, y: -8 }}
            id={MOBILE_SEARCH_PANEL_ID}
            initial={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <form
              action="/shop"
              className="group/search flex h-12 items-center border-b bg-muted/80 p-1 pl-4"
              role="search"
            >
              <Search className="mr-2 size-4.5 shrink-0 text-muted-foreground transition-colors group-focus-within/search:text-foreground" />
              <Input
                aria-label="Search products"
                className="h-auto min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden"
                name="query"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search furniture"
                ref={inputRef}
                type="search"
                value={query}
              />
              <Button
                aria-label="Submit search"
                className="shrink-0 rounded-full hover:bg-destructive motion-safe:hover:translate-x-px motion-safe:active:scale-90"
                size="icon"
                type="submit"
              >
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <div
              aria-live="polite"
              className="max-h-[min(24rem,60dvh)] overflow-y-auto px-4 py-2 sm:px-5"
            >
              <SearchResults
                currency={search.currency}
                debouncedQuery={search.debouncedQuery}
                errorMessage={search.errorMessage}
                isSearching={search.isSearching}
                locale={search.locale}
                query={query}
                results={search.results}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
