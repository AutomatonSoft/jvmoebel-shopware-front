"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type PaginationItem = number | "ellipsis";

export type ProductPaginationProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalPages: number;
  totalProducts: number;
};

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

export function ProductPagination({
  currentPage,
  onPageChange,
  pageSize,
  totalPages,
  totalProducts,
}: ProductPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const firstProduct = (currentPage - 1) * pageSize + 1;
  const lastProduct = Math.min(currentPage * pageSize, totalProducts);
  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <div className="mt-10 flex flex-col items-center gap-4 border-t pt-6 sm:flex-row sm:justify-between">
      <p className="text-xs text-muted-foreground" aria-live="polite">
        Showing {firstProduct}–{lastProduct} of {totalProducts} products
      </p>

      <nav aria-label="Product pages" className="flex items-center gap-1">
        <Button
          aria-label="Previous page"
          className="size-10 rounded-full"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          size="icon-lg"
          type="button"
          variant="ghost"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {paginationItems.map((item, index) =>
          item === "ellipsis" ? (
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center text-sm text-muted-foreground"
              key={`ellipsis-${index}`}
            >
              …
            </span>
          ) : (
            <Button
              aria-current={item === currentPage ? "page" : undefined}
              aria-label={`Page ${item}`}
              className="size-10 rounded-full"
              key={item}
              onClick={() => onPageChange(item)}
              size="icon-lg"
              type="button"
              variant={item === currentPage ? "default" : "ghost"}
            >
              {item}
            </Button>
          ),
        )}

        <Button
          aria-label="Next page"
          className="size-10 rounded-full"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          size="icon-lg"
          type="button"
          variant="ghost"
        >
          <ChevronRight className="size-4" />
        </Button>
      </nav>
    </div>
  );
}
