import { expect, test } from "bun:test";
import { getShopwareCategoryPageContent } from "./category-page";
import {
  deferred,
  fakeClient,
  rawCategory,
  turn,
} from "../../../tests/cache-audit/support";

const tree = [
  {
    id: "top",
    label: "Top",
    href: "/top",
    type: "page" as const,
    children: [
      {
        id: "nested",
        label: "Nested",
        href: "/top/nested",
        type: "page" as const,
        children: [],
      },
    ],
  },
];

test("T08: missing canonical ancestor links stay hidden", async () => {
  const api = fakeClient(({ operation, options }) => {
    if (operation.includes("/navigation/")) return [];
    const id = (options.pathParams as { navigationId: string }).navigationId;
    return {
      ...rawCategory(id, "page", "|root|top|missing|"),
      seoUrl: undefined,
    };
  });
  const page = await getShopwareCategoryPageContent(api.client, "leaf", tree);
  expect(page.breadcrumbs).toEqual([{ id: "top", label: "Top", href: "/top" }]);
});

test("T08: reuse all known breadcrumb ancestors, preserving order and canonical URLs", async () => {
  const api = fakeClient(({ operation, options }) => {
    if (operation.includes("/navigation/")) return [];
    const id = (options.pathParams as { navigationId: string }).navigationId;
    return {
      ...rawCategory(id, "page", "|root|top|nested|"),
      seoUrl: `/${id}`,
    };
  });
  const result = await getShopwareCategoryPageContent(api.client, "leaf", tree);
  expect(result.breadcrumbs).toEqual([
    { id: "top", label: "Top", href: "/top" },
    { id: "nested", label: "Nested", href: "/top/nested" },
  ]);
  expect(
    api.calls
      .filter(({ operation }) => operation.includes("/category/"))
      .map(
        ({ options }) =>
          (options.pathParams as { navigationId: string }).navigationId,
      ),
  ).toEqual(["leaf"]);
});

test("T08: fetch only missing ancestors and do not expose fallback category URLs", async () => {
  const api = fakeClient(({ operation, options }) => {
    if (operation.includes("/navigation/")) return [];
    const id = (options.pathParams as { navigationId: string }).navigationId;
    return {
      ...rawCategory(id, "page", "|root|top|missing|"),
      name: id,
      translated: { name: id },
      seoUrl: id === "missing" ? "/missing-canonical" : `/${id}`,
    };
  });
  const result = await getShopwareCategoryPageContent(api.client, "leaf", tree);
  expect(result.breadcrumbs).toEqual([
    { id: "top", label: "Top", href: "/top" },
    { id: "missing", label: "missing", href: "/missing-canonical" },
  ]);
  expect(
    api.calls
      .filter(({ operation }) => operation.includes("/category/"))
      .map(
        ({ options }) =>
          (options.pathParams as { navigationId: string }).navigationId,
      )
      .sort(),
  ).toEqual(["leaf", "missing"]);
});

test("T08: pending navigation does not trigger speculative ancestor requests", async () => {
  const navigation = deferred<typeof tree>();
  const api = fakeClient(({ operation, options }) =>
    operation.includes("/navigation/")
      ? []
      : rawCategory(
          (options.pathParams as { navigationId: string }).navigationId,
          "page",
          "|root|top|nested|",
        ),
  );
  const pending = getShopwareCategoryPageContent(
    api.client,
    "leaf",
    navigation.promise,
  );
  await turn();
  const callsBeforeNavigation = api.calls.filter(({ operation }) =>
    operation.includes("/category/"),
  ).length;
  navigation.resolve(tree);
  await pending;
  expect(callsBeforeNavigation).toBe(1);
});
