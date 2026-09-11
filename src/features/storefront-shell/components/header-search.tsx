"use client";

import { ArrowRight, Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchResults } from "@/features/search/components/search-results";
import { useProductSearch } from "@/features/search/hooks/use-product-search";

const headerSearchOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const headerSearchPanelVariants = {
  hidden: { opacity: 0, scale: 0.98, y: -12 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export type HeaderSearchProps = {
  className: string;
};

export function HeaderSearch({ className }: HeaderSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const overlayInputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const search = useProductSearch(query, isOpen);

  const requestClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const bodyPaddingRight = Number.parseFloat(
      window.getComputedStyle(document.body).paddingRight,
    );

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${bodyPaddingRight + scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      overlayInputRef.current?.focus({ preventScroll: true });
    });
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, requestClose]);

  return (
    <>
      <form
        action="/moebel-sortiment"
        className={`group/search h-11 items-center rounded-full border bg-muted/80 p-1 pl-4 transition-[background,border-color,box-shadow] hover:border-foreground/15 hover:bg-card/70 focus-within:border-foreground/25 focus-within:bg-card focus-within:ring-3 focus-within:ring-primary/15 ${className}`}
        onFocus={() => {
          setIsOpen(true);
        }}
        role="search"
      >
        <Search className="mr-2 size-4.5 shrink-0 text-muted-foreground transition-colors group-focus-within/search:text-foreground" />
        <Input
          aria-label="Produkte suchen"
          className="h-auto min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden"
          name="query"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Möbel suchen"
          type="search"
          value={query}
        />
        <div className="flex shrink-0">
          <Button
            aria-label="Suche starten"
            className="shrink-0 rounded-full hover:bg-destructive motion-safe:hover:translate-x-px motion-safe:active:scale-90"
            size="icon-lg"
            type="submit"
          >
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </form>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                animate="visible"
                className="fixed inset-0 z-100 flex items-start justify-center bg-foreground/20 px-4 pt-[max(5.5rem,10vh)] backdrop-blur-sm"
                exit="hidden"
                initial="hidden"
                key="header-search-overlay"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) requestClose();
                }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                variants={headerSearchOverlayVariants}
              >
                <motion.section
                  animate="visible"
                  aria-label="Produktsuche"
                  aria-modal="true"
                  className="w-[min(50vw,48rem)] overflow-hidden rounded-[1.375rem] border bg-background shadow-2xl"
                  exit={shouldReduceMotion ? { opacity: 0 } : "hidden"}
                  initial={shouldReduceMotion ? false : "hidden"}
                  role="dialog"
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.24,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  variants={headerSearchPanelVariants}
                >
                  <form
                    action="/moebel-sortiment"
                    className="group/search flex h-11 items-center border-b bg-muted/80 p-1 pl-4"
                    role="search"
                  >
                    <Search className="mr-2 size-4.5 shrink-0 text-muted-foreground transition-colors group-focus-within/search:text-foreground" />
                    <Input
                      aria-label="Produkte suchen"
                      className="h-auto min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden"
                      name="query"
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Möbel suchen"
                      ref={overlayInputRef}
                      type="search"
                      value={query}
                    />
                    <div className="flex shrink-0">
                      <Button
                        aria-label="Suche starten"
                        className="shrink-0 rounded-full"
                        size="icon-lg"
                        type="submit"
                      >
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </form>

                  <div
                    aria-live="polite"
                    className="max-h-[min(30rem,70dvh)] min-h-18 overflow-y-auto px-5 pt-3 pb-4"
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
                </motion.section>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
