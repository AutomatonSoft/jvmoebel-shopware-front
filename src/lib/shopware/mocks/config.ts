export function shouldUseShopwareMocks() {
  const value = process.env.SHOPWARE_USE_MOCKS?.trim().toLowerCase();

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return process.env.NODE_ENV === "development";
}
