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
import type { AddToCartActionState } from "@/features/cart/model/cart";
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

export async function addProductToCart(
  _previousState: AddToCartActionState,
  formData: FormData,
): Promise<AddToCartActionState> {
  const productId = parseProductId(formData);

  if (!productId) {
    return {
      message: "Das Produkt konnte nicht hinzugefügt werden.",
      status: "error",
    };
  }

  try {
    if (shouldUseShopwareMocks()) {
      await addMockProduct(productId);
    } else {
      const session = await createCustomerSession();

      if (!(await isShopwareProductAvailable(session.client, productId))) {
        throw new ProductUnavailableError();
      }

      const result = await addShopwareProduct(session.client, productId);

      if (!result.succeeded) {
        return {
          message:
            "Shopware konnte den Artikel nicht in den Warenkorb übernehmen.",
          status: "error",
        };
      }

      await persistCustomerContext(session.getContextToken());
    }

    revalidatePath("/", "layout");
    revalidatePath("/kasse");
    revalidatePath("/warenkorb");

    return { status: "success" };
  } catch (error) {
    if (error instanceof ProductUnavailableError) {
      return {
        message: "Dieser Artikel ist derzeit nicht verfügbar.",
        status: "error",
      };
    }

    console.error("Adding product to cart failed.", error);
    return {
      message:
        "Der Artikel konnte nicht hinzugefügt werden. Bitte versuchen Sie es erneut.",
      status: "error",
    };
  }
}
