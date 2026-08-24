import type { StoreNavigationItem } from "@/lib/shopware/navigation";

export const mainNavigationMock = [
  {
    id: "new-in",
    label: "New in",
    href: "/new-in",
    children: [],
  },
  {
    id: "living",
    label: "Living",
    href: "/living",
    children: [
      {
        id: "sofas",
        label: "Sofas",
        href: "/living/sofas",
        children: [],
      },
      {
        id: "armchairs",
        label: "Armchairs",
        href: "/living/armchairs",
        children: [],
      },
    ],
  },
  {
    id: "dining",
    label: "Dining",
    href: "/dining",
    children: [],
  },
  {
    id: "bedroom",
    label: "Bedroom",
    href: "/bedroom",
    children: [],
  },
  {
    id: "storage",
    label: "Storage",
    href: "/storage",
    children: [],
  },
  {
    id: "sale",
    label: "Sale",
    href: "/sale",
    children: [],
  },
] satisfies StoreNavigationItem[];
