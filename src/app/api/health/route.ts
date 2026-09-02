import { getShopwareConfig } from "@/integrations/shopware/config";
import { getShopwareDataMode } from "@/integrations/shopware/mock-mode";

export function GET() {
  try {
    const shopwareMode = getShopwareDataMode();

    if (shopwareMode === "live") {
      getShopwareConfig();
    }

    return Response.json({ shopwareMode, status: "ok" });
  } catch (error) {
    console.error(
      "[health] Invalid storefront configuration:",
      error instanceof Error ? error.message : "Unknown configuration error.",
    );

    return Response.json({ status: "error" }, { status: 503 });
  }
}
