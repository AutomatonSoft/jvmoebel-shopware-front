"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";

import { parseProductVariantSelection } from "@/features/catalog/model/validation";
import { getCanonicalProductPath } from "@/features/storefront-shell/server/storefront-route";
import { findShopwareProductVariant } from "@/integrations/shopware/product-detail";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

export async function selectProductVariant(formData: FormData) {
  const selection = parseProductVariantSelection(formData);

  if (!selection) {
    redirect("/moebel-sortiment");
  }

  const client = getShopwareRequestSession().client;
  let variantId: string | null = null;

  try {
    variantId = await findShopwareProductVariant(
      client,
      selection.parentProductId,
      selection.optionIds,
      selection.switchedGroupId,
    );
  } catch (error) {
    console.error("Product variant selection failed.", error);
  }

  const destinationProductId = variantId ?? selection.currentProductId;
  let destination = `/produkt/${encodeURIComponent(destinationProductId)}`;

  try {
    destination =
      (await getCanonicalProductPath(destinationProductId)) ?? destination;
  } catch (error) {
    console.error("Product variant URL lookup failed.", error);
  }

  redirect(`${destination}${variantId ? "" : "?fehler=variante"}` as Route);
}
