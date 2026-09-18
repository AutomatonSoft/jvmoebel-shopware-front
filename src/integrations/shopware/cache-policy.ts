const minuteInSeconds = 60;
const hourInSeconds = 60 * minuteInSeconds;

export const shopwareCacheTtlSeconds = {
  categoryChildren: hourInSeconds,
  categoryPage: 2 * minuteInSeconds,
  homeCmsPage: 10 * minuteInSeconds,
  productDetail: 2 * minuteInSeconds,
  productListing: 5 * minuteInSeconds,
  productListingPage: 2 * minuteInSeconds,
  registrationOptions: 6 * hourInSeconds,
  seo: 10 * minuteInSeconds,
  storefrontShell: hourInSeconds,
} as const;
