import type { NextRequest } from "next/server";

import { searchProducts } from "@/features/search/server/product-search";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim() ?? "";

  if (!query) {
    return Response.json(
      { message: "A search query is required." },
      { status: 400 },
    );
  }

  try {
    const response = await searchProducts(query);

    return Response.json(response, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Product search failed", error);

    return Response.json(
      { message: "Product search is temporarily unavailable." },
      { status: 502 },
    );
  }
}
