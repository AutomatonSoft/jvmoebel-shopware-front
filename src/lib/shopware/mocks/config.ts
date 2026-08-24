export function shouldUseShopwareMocks() {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.SHOPWARE_USE_MOCKS !== "false"
  );
}
