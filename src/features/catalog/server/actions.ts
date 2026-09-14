"use server";

import { redirect } from "next/navigation";

import { findShopwareProductVariant } from "@/integrations/shopware/product-detail";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

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

  let variantId: string | null = null;

  try {
    variantId = await findShopwareProductVariant(
      getShopwareRequestSession().client,
      parentProductId,
      optionIds,
      switchedGroupId,
    );
  } catch (error) {
    console.error("Product variant selection failed.", error);
  }

  redirect(
    variantId
      ? `/produkt/${encodeURIComponent(variantId)}`
      : `/produkt/${encodeURIComponent(currentProductId)}?fehler=variante`,
  );
}
