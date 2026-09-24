/* eslint-disable no-console -- Audit CLI emits measurements without credentials. */
/** Read-only, sequential measurements. Never prints credentials or response bodies. */
import { createShopwareClient } from "../../src/integrations/shopware/client";
import { defaultShopProductPageRequest } from "../../src/features/catalog/model/product-listing-page";
import { getShopwareProductListingPage } from "../../src/integrations/shopware/product-listing";

const client = createShopwareClient();
type ProbeOptions = {
  fetchOptions?: Record<string, unknown>;
  [key: string]: unknown;
};
const invoke = client.invoke.bind(client) as unknown as (
  operation: string,
  options?: ProbeOptions,
) => Promise<{ status: number; data: unknown }>;
client.invoke = (async (operation: string, options?: ProbeOptions) => {
  const started = performance.now();
  try {
    const result = await invoke(operation, {
      ...options,
      fetchOptions: { ...options?.fetchOptions, timeout: 15_000, retry: 0 },
    });
    console.log(
      JSON.stringify({
        operation,
        ms: Math.round(performance.now() - started),
        status: result.status,
      }),
    );
    return result;
  } catch (error) {
    console.log(
      JSON.stringify({
        operation,
        ms: Math.round(performance.now() - started),
        error: error instanceof Error ? error.name : "unknown",
      }),
    );
    throw error;
  }
}) as unknown as typeof client.invoke;

console.log(
  JSON.stringify({
    endpointOrigin: new URL(process.env.SHOPWARE_ENDPOINT!).origin,
    note: "Local machine -> configured API; not stage SSR timing. Probe enforces its own 15 s timeout.",
  }),
);
try {
  for (let sample = 1; sample <= 3; sample++) {
    const started = performance.now();
    const page = await getShopwareProductListingPage(
      client,
      defaultShopProductPageRequest,
    );
    console.log(
      JSON.stringify({
        sample,
        operation: "root-listing-total",
        ms: Math.round(performance.now() - started),
        products: page.products.length,
        total: page.pagination.totalProducts,
      }),
    );
  }
} catch {
  process.exitCode = 1;
}
