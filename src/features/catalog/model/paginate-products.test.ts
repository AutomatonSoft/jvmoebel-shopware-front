import { describe, expect, test } from "bun:test";

import {
  paginateProducts,
  productsPerPage,
} from "@/features/catalog/model/paginate-products";

const products = Array.from({ length: productsPerPage * 2 + 1 }, (_, index) =>
  String(index + 1),
);

describe("shop product pagination", () => {
  test("returns the requested page and listing totals", () => {
    expect(paginateProducts(products, 2)).toEqual({
      currentPage: 2,
      products: products.slice(productsPerPage, productsPerPage * 2),
      totalPages: 3,
      totalProducts: products.length,
    });
  });

  test("clamps a page that is outside the available range", () => {
    expect(paginateProducts(products, 99).currentPage).toBe(3);
    expect(paginateProducts(products, 0).currentPage).toBe(1);
  });

  test("keeps an empty listing on page one", () => {
    expect(paginateProducts([], 4)).toEqual({
      currentPage: 1,
      products: [],
      totalPages: 0,
      totalProducts: 0,
    });
  });
});
