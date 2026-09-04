export const productsPerPage = 8;

export function paginateProducts<TProduct>(
  products: readonly TProduct[],
  requestedPage: number,
) {
  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentPage =
    totalPages === 0
      ? 1
      : Math.min(Math.max(Math.trunc(requestedPage), 1), totalPages);
  const startIndex = (currentPage - 1) * productsPerPage;

  return {
    currentPage,
    products: products.slice(startIndex, startIndex + productsPerPage),
    totalPages,
    totalProducts: products.length,
  };
}
