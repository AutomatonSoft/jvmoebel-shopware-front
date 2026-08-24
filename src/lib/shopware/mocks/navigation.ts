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

export const footerNavigationMock = [
  {
    id: "footer-shop",
    label: "Shop",
    href: "/shop",
    children: [
      {
        id: "footer-new-arrivals",
        label: "New arrivals",
        href: "/new-in",
        children: [],
      },
      {
        id: "footer-living",
        label: "Living room",
        href: "/living",
        children: [],
      },
      {
        id: "footer-dining",
        label: "Dining room",
        href: "/dining",
        children: [],
      },
      {
        id: "footer-bedroom",
        label: "Bedroom",
        href: "/bedroom",
        children: [],
      },
      {
        id: "footer-sale",
        label: "Sale",
        href: "/sale",
        children: [],
      },
    ],
  },
  {
    id: "footer-services",
    label: "Services",
    href: "/services",
    children: [
      {
        id: "footer-delivery",
        label: "Delivery",
        href: "/services/delivery",
        children: [],
      },
      {
        id: "footer-assembly",
        label: "Assembly",
        href: "/services/assembly",
        children: [],
      },
      {
        id: "footer-returns",
        label: "Returns",
        href: "/services/returns",
        children: [],
      },
      {
        id: "footer-design-advice",
        label: "Design advice",
        href: "/services/design-advice",
        children: [],
      },
      {
        id: "footer-showroom",
        label: "Showroom",
        href: "/showroom",
        children: [],
      },
    ],
  },
  {
    id: "footer-about",
    label: "About",
    href: "/about",
    children: [
      {
        id: "footer-about-us",
        label: "About us",
        href: "/about",
        children: [],
      },
      {
        id: "footer-journal",
        label: "Journal",
        href: "/journal",
        children: [],
      },
      {
        id: "footer-materials",
        label: "Materials",
        href: "/materials",
        children: [],
      },
      {
        id: "footer-careers",
        label: "Careers",
        href: "/careers",
        children: [],
      },
      {
        id: "footer-contact",
        label: "Contact",
        href: "/contact",
        children: [],
      },
    ],
  },
] satisfies StoreNavigationItem[];

export const serviceNavigationMock = [
  {
    id: "privacy",
    label: "Privacy",
    href: "/privacy",
    children: [],
  },
  {
    id: "terms",
    label: "Terms",
    href: "/terms",
    children: [],
  },
  {
    id: "imprint",
    label: "Imprint",
    href: "/imprint",
    children: [],
  },
] satisfies StoreNavigationItem[];
