import { getWishlistProducts } from "@/features/wishlist/server/wishlist-products";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const productIds =
      body && typeof body === "object" && "productIds" in body
        ? body.productIds
        : undefined;
    const listing = await getWishlistProducts(productIds);

    return Response.json(listing, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Wishlist products failed", error);

    return Response.json(
      { message: "Wishlist products are temporarily unavailable." },
      { status: 502 },
    );
  }
}
