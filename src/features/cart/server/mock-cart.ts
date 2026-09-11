import "server-only";

import { cookies } from "next/headers";

import {
  createShopCartMock,
  initialShopCartMockQuantities,
} from "@/features/cart/fixtures/cart";
import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";

const mockCartCookie = "jv-mock-cart";
const productIds = new Set(
  shopProductListingMock.products.map((product) => product.id),
);

type MockCartState = Readonly<{
  promotionCode?: string;
  quantities: Readonly<Record<string, number>>;
}>;

function parseMockCartState(value?: string): MockCartState | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as {
      promotionCode?: unknown;
      quantities?: unknown;
    };
    const quantitiesRecord =
      parsed.quantities && typeof parsed.quantities === "object"
        ? (parsed.quantities as Record<string, unknown>)
        : {};
    const quantities = Object.fromEntries(
      Object.entries(quantitiesRecord).flatMap(([id, quantity]) =>
        productIds.has(id) &&
        typeof quantity === "number" &&
        Number.isSafeInteger(quantity) &&
        quantity > 0 &&
        quantity <= 10
          ? [[id, quantity]]
          : [],
      ),
    );

    return {
      promotionCode:
        typeof parsed.promotionCode === "string"
          ? parsed.promotionCode.slice(0, 40)
          : undefined,
      quantities,
    };
  } catch {
    return null;
  }
}

async function getMockCartState() {
  const cookieStore = await cookies();

  return (
    parseMockCartState(cookieStore.get(mockCartCookie)?.value) ?? {
      quantities: initialShopCartMockQuantities,
    }
  );
}

async function persistMockCartState(state: MockCartState) {
  const cookieStore = await cookies();

  cookieStore.set(mockCartCookie, JSON.stringify(state), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
  });
}

export async function getMockShopCart() {
  const state = await getMockCartState();

  return createShopCartMock(state.quantities, state.promotionCode);
}

export async function updateMockCartItem(id: string, quantity: number) {
  const state = await getMockCartState();

  if (!productIds.has(id)) {
    throw new Error(`Unknown mock product: ${id}`);
  }

  await persistMockCartState({
    ...state,
    quantities: { ...state.quantities, [id]: quantity },
  });
}

export async function removeMockCartItem(id: string) {
  const state = await getMockCartState();
  const quantities = { ...state.quantities };

  delete quantities[id];
  await persistMockCartState({ ...state, quantities });
}

export async function applyMockPromotionCode(code: string) {
  const state = await getMockCartState();

  await persistMockCartState({ ...state, promotionCode: code });
}

export async function addMockProduct(id: string) {
  const state = await getMockCartState();

  if (!productIds.has(id)) {
    throw new Error(`Unknown mock product: ${id}`);
  }

  await persistMockCartState({
    ...state,
    quantities: {
      ...state.quantities,
      [id]: Math.min((state.quantities[id] ?? 0) + 1, 10),
    },
  });
}
