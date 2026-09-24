export function getSearchUrl(query: string) {
  return `/suche?query=${encodeURIComponent(query.trim())}`;
}
