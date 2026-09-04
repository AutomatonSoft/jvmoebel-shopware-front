export const offerCategories = [
  {
    image: "/images/main/hero-editorial.webp",
    label: "Garten & Freizeit",
    value: "garden-leisure",
  },
  {
    image: "/images/main/dining-room.webp",
    label: "Tische",
    value: "tables",
  },
  {
    image: "/images/main/hero-living.webp",
    label: "Sofas & Couches",
    value: "sofas",
  },
  { image: "/images/main/bedroom.webp", label: "Betten", value: "beds" },
  {
    image: "/images/main/lounge-chair.webp",
    label: "Stühle",
    value: "chairs",
  },
  {
    image: "/images/main/media-console.webp",
    label: "Schränke",
    value: "storage",
  },
  { image: "/images/main/bedroom.webp", label: "Lampen", value: "lamps" },
  {
    image: "/images/main/media-console.webp",
    label: "Regale",
    value: "shelves",
  },
  {
    image: "/images/main/lounge-chair.webp",
    label: "Sessel",
    value: "armchairs",
  },
  {
    image: "/images/main/media-console.webp",
    label: "Sideboards",
    value: "sideboards",
  },
  {
    image: "/images/main/dining-room.webp",
    label: "Kommoden",
    value: "dressers",
  },
  {
    image: "/images/main/media-console.webp",
    label: "TV-Möbel",
    value: "tv-furniture",
  },
  {
    image: "/images/main/bedroom.webp",
    label: "Badmöbel",
    value: "bathroom-furniture",
  },
  {
    image: "/images/main/hero-editorial.webp",
    label: "Teppiche",
    value: "rugs",
  },
  {
    image: "/images/main/bedroom.webp",
    label: "Textilien",
    value: "textiles",
  },
  {
    image: "/images/main/dining-room.webp",
    label: "Accessoires",
    value: "accessories",
  },
] as const;

export function findOfferCategory(value: string) {
  return offerCategories.find((category) => category.value === value);
}
