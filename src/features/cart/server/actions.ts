"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createCustomerSession,
  persistCustomerContext,
} from "@/features/customer-account/server/session";
import {
  addMockProduct,
  applyMockPromotionCode,
  removeMockCartItem,
  updateMockCartItem,
} from "@/features/cart/server/mock-cart";
import {
  addShopwareProduct,
  addShopwarePromotion,
  removeShopwareCartItem,
  updateShopwareCartItem,
} from "@/integrations/shopware/cart";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";

function getRequiredString(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" && value.trim() ? value.trim() : null;
}

async function runCartMutation(
  mutation: (
    session: Awaited<ReturnType<typeof createCustomerSession>>,
  ) => Promise<void>,
) {
  try {
    const session = await createCustomerSession();

    await mutation(session);
    await persistCustomerContext(session.getContextToken());
    revalidatePath("/warenkorb");
  } catch (error) {
    console.error("Cart mutation failed.", error);
    redirect("/warenkorb?fehler=aktualisierung");
  }
}

async function runMockCartMutation(mutation: () => Promise<void>) {
  try {
    await mutation();
    revalidatePath("/warenkorb");
  } catch (error) {
    console.error("Mock cart mutation failed.", error);
    redirect("/warenkorb?fehler=aktualisierung");
  }
}

export async function updateCartItem(formData: FormData) {
  const id = getRequiredString(formData, "id");
  const quantityValue = getRequiredString(formData, "quantity");
  const quantity = quantityValue ? Number(quantityValue) : Number.NaN;

  if (!id || !Number.isSafeInteger(quantity) || quantity < 1) {
    redirect("/warenkorb?fehler=eingabe");
  }

  if (shouldUseShopwareMocks()) {
    await runMockCartMutation(() => updateMockCartItem(id, quantity));
  } else {
    await runCartMutation((session) =>
      updateShopwareCartItem(session.client, id, quantity),
    );
  }

  redirect("/warenkorb?meldung=menge");
}

export async function removeCartItem(formData: FormData) {
  const id = getRequiredString(formData, "id");

  if (!id) {
    redirect("/warenkorb?fehler=eingabe");
  }

  if (shouldUseShopwareMocks()) {
    await runMockCartMutation(() => removeMockCartItem(id));
  } else {
    await runCartMutation((session) =>
      removeShopwareCartItem(session.client, id),
    );
  }

  redirect("/warenkorb?meldung=entfernt");
}

export async function applyPromotionCode(formData: FormData) {
  const code = getRequiredString(formData, "code");

  if (!code) {
    redirect("/warenkorb?fehler=gutschein");
  }

  if (shouldUseShopwareMocks()) {
    await runMockCartMutation(() => applyMockPromotionCode(code));
  } else {
    await runCartMutation((session) =>
      addShopwarePromotion(session.client, code),
    );
  }

  redirect("/warenkorb?meldung=gutschein");
}

export async function addProductToCart(formData: FormData) {
  const productId = getRequiredString(formData, "productId");

  if (!productId) {
    redirect("/warenkorb?fehler=eingabe");
  }

  if (shouldUseShopwareMocks()) {
    await runMockCartMutation(() => addMockProduct(productId));
  } else {
    await runCartMutation((session) =>
      addShopwareProduct(session.client, productId),
    );
  }

  redirect("/warenkorb?meldung=hinzugefuegt");
}
