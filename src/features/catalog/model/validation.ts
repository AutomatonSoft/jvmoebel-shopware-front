import { z } from "zod";

import type { ShopProductVariantSelection } from "@/features/catalog/model/product-detail";

const identifierSchema = z.string().trim().min(1);

const productVariantSelectionSchema = z.object({
  currentProductId: identifierSchema,
  optionIds: z.array(z.string().min(1)).min(1),
  parentProductId: identifierSchema,
  switchedGroupId: identifierSchema,
});

export function parseProductVariantSelection(
  formData: FormData,
): ShopProductVariantSelection | null {
  const result = productVariantSelectionSchema.safeParse({
    currentProductId: formData.get("currentProductId"),
    optionIds: formData
      .getAll("optionId")
      .filter((value): value is string => typeof value === "string" && !!value),
    parentProductId: formData.get("parentProductId"),
    switchedGroupId: formData.get("switchedGroupId"),
  });

  return result.success ? result.data : null;
}
