const minuteInSeconds = 60;
const hourInSeconds = 60 * minuteInSeconds;

export const shopwareCacheTtlSeconds = {
  categoryChildren: hourInSeconds,
  categoryPage: 10 * minuteInSeconds,
  homeCmsPage: 10 * minuteInSeconds,
  landingPage: 10 * minuteInSeconds,
  registrationOptions: 6 * hourInSeconds,
  seo: 10 * minuteInSeconds,
  storefrontShell: hourInSeconds,
} as const;

export function shopwareCacheLife(revalidate: number) {
  return { revalidate, expire: Math.max(revalidate * 6, hourInSeconds) };
}
