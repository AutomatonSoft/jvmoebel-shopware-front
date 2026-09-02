"use client";

import { ArrowRight, Search } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchResults } from "@/features/search/components/search-results";
import { useProductSearch } from "@/features/search/hooks/use-product-search";

const headerSearchLayoutTransition = {
  damping: 28,
  mass: 0.9,
  stiffness: 210,
  type: "spring" as const,
};

export type HeaderSearchProps = {
  className: string;
};

export function HeaderSearch({ className }: HeaderSearchProps) {
  const [isCloseRequested, setIsCloseRequested] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchSettled, setIsSearchSettled] = useState(false);
  const [query, setQuery] = useState("");
  const isSearchSettledRef = useRef(false);
  const overlayInputRef = useRef<HTMLInputElement>(null);
  const search = useProductSearch(query, isOpen);

  const requestClose = useCallback(() => {
    if (isSearchSettledRef.current) {
      isSearchSettledRef.current = false;
      setIsCloseRequested(true);
      setIsSearchSettled(false);
      return;
    }

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
    <LayoutGroup id="header-search">
      <motion.form
        action="/shop"
        className={`group/search h-11 items-center rounded-full border bg-muted/80 p-1 pl-4 transition-[background,border-color,box-shadow] hover:border-foreground/15 hover:bg-card/70 focus-within:border-foreground/25 focus-within:bg-card focus-within:ring-3 focus-within:ring-primary/15 ${className}`}
        layoutId="header-product-search"
        onFocus={() => {
          isSearchSettledRef.current = false;
          setIsCloseRequested(false);
          setIsSearchSettled(false);
          setIsOpen(true);
        }}
        role="search"
        style={{ borderRadius: 22 }}
        transition={{ layout: headerSearchLayoutTransition }}
      >
        <Search className="mr-2 size-4.5 shrink-0 text-muted-foreground transition-colors group-focus-within/search:text-foreground" />
        <Input
          aria-label="Search products"
          className="h-auto min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden"
          name="query"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search furniture"
          type="search"
          value={query}
        />
        <motion.div
          className="flex shrink-0"
          layoutId="header-search-submit"
          style={{ borderRadius: 999 }}
          transition={{ layout: headerSearchLayoutTransition }}
        >
          <Button
            aria-label="Submit search"
            className="shrink-0 rounded-full hover:bg-destructive motion-safe:hover:translate-x-px motion-safe:active:scale-90"
            size="icon-lg"
            type="submit"
          >
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      </motion.form>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-100 flex items-start justify-center bg-foreground/20 px-4 pt-[max(5.5rem,10vh)] backdrop-blur-sm"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="header-search-overlay"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) requestClose();
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <section
                  aria-label="Product search"
                  aria-modal="true"
                  className="w-[min(50vw,48rem)]"
                  role="dialog"
                >
                  <motion.form
                    action="/shop"
                    className={`relative z-10 flex h-11 items-center rounded-[1.375rem] border bg-muted/80 p-1 pl-4 transition-[border-color,box-shadow] duration-300 ${isSearchSettled ? "border-transparent shadow-none" : "shadow-lg"}`}
                    layoutId="header-product-search"
                    onLayoutAnimationComplete={() => {
                      if (isOpen && !isCloseRequested) {
                        isSearchSettledRef.current = true;
                        setIsSearchSettled(true);
                      }
                    }}
                    role="search"
                    style={{ borderRadius: 22 }}
                    transition={{ layout: headerSearchLayoutTransition }}
                  >
                    <Search className="mr-2 size-4.5 shrink-0 text-muted-foreground" />
                    <Input
                      aria-label="Search products"
                      className="h-auto min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden"
                      name="query"
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search furniture"
                      ref={overlayInputRef}
                      type="search"
                      value={query}
                    />
                    <motion.div
                      className="flex shrink-0"
                      layoutId="header-search-submit"
                      style={{ borderRadius: 999 }}
                      transition={{ layout: headerSearchLayoutTransition }}
                    >
                      <Button
                        aria-label="Submit search"
                        className="shrink-0 rounded-full"
                        size="icon-lg"
                        type="submit"
                      >
                        <ArrowRight className="size-4" />
                      </Button>
                    </motion.div>
                  </motion.form>

                  <AnimatePresence
                    initial={false}
                    onExitComplete={() => {
                      if (isCloseRequested) {
                        setIsCloseRequested(false);
                        setIsOpen(false);
                      }
                    }}
                  >
                    {isSearchSettled && (
                      <motion.div
                        animate={{ height: "auto", opacity: 1 }}
                        className="-mt-11 overflow-hidden rounded-[1.375rem] border bg-background pt-11 shadow-2xl"
                        exit={{ height: 44, opacity: 0 }}
                        initial={{ height: 44, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </LayoutGroup>
  );
}
