import { z } from "zod";

const identifierSchema = z.string().trim().min(1);

const cartItemUpdateSchema = z.object({
  id: identifierSchema,
  quantity: identifierSchema
    .transform((value) => Number(value))
    .pipe(z.number().int().min(1).max(Number.MAX_SAFE_INTEGER)),
});

function parseIdentifier(formData: FormData, name: string) {
  const result = identifierSchema.safeParse(formData.get(name));

  return result.success ? result.data : null;
}

export function parseCartItemUpdate(formData: FormData) {
  const result = cartItemUpdateSchema.safeParse({
    id: formData.get("id"),
    quantity: formData.get("quantity"),
  });

  return result.success ? result.data : null;
}

export function parseCartItemRemoval(formData: FormData) {
  return parseIdentifier(formData, "id");
}

export function parsePromotionCode(formData: FormData) {
  return parseIdentifier(formData, "code");
}

export function parseProductId(formData: FormData) {
  return parseIdentifier(formData, "productId");
}
