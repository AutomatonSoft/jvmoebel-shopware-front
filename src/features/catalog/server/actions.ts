"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";

import { findShopwareProductVariant } from "@/integrations/shopware/product-detail";
import { getShopwareRequestSession } from "@/integrations/shopware/session";
import { getShopwareCanonicalProductPath } from "@/integrations/shopware/storefront-route";

function getRequiredString(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function selectProductVariant(formData: FormData) {
  const currentProductId = getRequiredString(formData, "currentProductId");
  const parentProductId = getRequiredString(formData, "parentProductId");
  const switchedGroupId = getRequiredString(formData, "switchedGroupId");
  const optionIds = formData
    .getAll("optionId")
    .filter((value): value is string => typeof value === "string" && !!value);

  if (
    !currentProductId ||
    !parentProductId ||
    !switchedGroupId ||
    optionIds.length === 0
  ) {
    redirect("/moebel-sortiment");
  }

  const client = getShopwareRequestSession().client;
  let variantId: string | null = null;

  try {
    variantId = await findShopwareProductVariant(
      client,
      parentProductId,
      optionIds,
      switchedGroupId,
    );
  } catch (error) {
    console.error("Product variant selection failed.", error);
  }

  const destinationProductId = variantId ?? currentProductId;
  let destination = `/produkt/${encodeURIComponent(destinationProductId)}`;

  try {
    destination =
      (await getShopwareCanonicalProductPath(client, destinationProductId)) ??
      destination;
  } catch (error) {
    console.error("Product variant URL lookup failed.", error);
  }

  redirect(`${destination}${variantId ? "" : "?fehler=variante"}` as Route);
}
