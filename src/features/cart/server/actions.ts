"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createCustomerSession,
  persistCustomerContext,
} from "@/features/customer-account/server/session";
import {
  parseCartItemRemoval,
  parseCartItemUpdate,
  parseProductId,
  parsePromotionCode,
} from "@/features/cart/model/validation";
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
import { isShopwareProductAvailable } from "@/integrations/shopware/product-detail";

class ProductUnavailableError extends Error {}

async function runCartMutation<Result>(
  mutation: (
    session: Awaited<ReturnType<typeof createCustomerSession>>,
  ) => Promise<Result>,
) {
  try {
    const session = await createCustomerSession();

    const result = await mutation(session);

    await persistCustomerContext(session.getContextToken());
    revalidatePath("/kasse");
    revalidatePath("/warenkorb");

    return result;
  } catch (error) {
    if (error instanceof ProductUnavailableError) {
      redirect("/warenkorb?fehler=nicht-verfuegbar");
    }

    console.error("Cart mutation failed.", error);
    redirect("/warenkorb?fehler=aktualisierung");
  }
}

async function runMockCartMutation(mutation: () => Promise<void>) {
  try {
    await mutation();
    revalidatePath("/kasse");
    revalidatePath("/warenkorb");
  } catch (error) {
    console.error("Mock cart mutation failed.", error);
    redirect("/warenkorb?fehler=aktualisierung");
  }
}

function getCartReturnPath(formData: FormData) {
  return formData.get("returnTo") === "/kasse?schritt=bestaetigung"
    ? "/kasse?schritt=bestaetigung"
    : "/warenkorb";
}

export async function updateCartItem(formData: FormData) {
  const returnPath = getCartReturnPath(formData);
  const cartItem = parseCartItemUpdate(formData);

  if (!cartItem) {
    redirect("/warenkorb?fehler=eingabe");
  }

  if (shouldUseShopwareMocks()) {
    await runMockCartMutation(() =>
      updateMockCartItem(cartItem.id, cartItem.quantity),
    );
  } else {
    await runCartMutation((session) =>
      updateShopwareCartItem(session.client, cartItem.id, cartItem.quantity),
    );
  }

  redirect(returnPath);
}

export async function removeCartItem(formData: FormData) {
  const returnPath = getCartReturnPath(formData);
  const id = parseCartItemRemoval(formData);

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

  redirect(returnPath);
}

export async function applyPromotionCode(formData: FormData) {
  const code = parsePromotionCode(formData);

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
  const productId = parseProductId(formData);

  if (!productId) {
    redirect("/warenkorb?fehler=eingabe");
  }

  if (shouldUseShopwareMocks()) {
    await runMockCartMutation(() => addMockProduct(productId));
  } else {
    const result = await runCartMutation(async (session) => {
      if (!(await isShopwareProductAvailable(session.client, productId))) {
        throw new ProductUnavailableError();
      }

      return addShopwareProduct(session.client, productId);
    });

    if (!result.succeeded) {
      redirect("/warenkorb?fehler=shopware");
    }
  }

  redirect("/warenkorb?meldung=hinzugefuegt");
}
