"use client";

import { ArrowRight, Search } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const overlayInputRef = useRef<HTMLInputElement>(null);

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
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <LayoutGroup id="header-search">
      <motion.form
        action="/shop"
        className={`group/search h-11 items-center rounded-full border bg-muted/80 p-1 pl-4 transition-[background,border-color,box-shadow] hover:border-foreground/15 hover:bg-card/70 focus-within:border-foreground/25 focus-within:bg-card focus-within:ring-3 focus-within:ring-primary/15 ${className}`}
        layoutId="header-product-search"
        onFocus={() => setIsOpen(true)}
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
                  if (event.target === event.currentTarget) setIsOpen(false);
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <motion.section
                  aria-label="Product search"
                  aria-modal="true"
                  className="w-[min(66vw,60rem)] overflow-hidden rounded-[1.375rem] border bg-background shadow-2xl"
                  layoutId="header-product-search"
                  role="dialog"
                  style={{ borderRadius: 22 }}
                  transition={{ layout: headerSearchLayoutTransition }}
                >
                  <motion.form
                    action="/shop"
                    className="relative flex h-11 items-center bg-muted/80 p-1 pl-4"
                    layout="position"
                    role="search"
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
                </motion.section>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </LayoutGroup>
  );
}
