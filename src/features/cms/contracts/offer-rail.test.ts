import { describe, expect, test } from "bun:test";

import { parseCmsOfferRailData } from "@/features/cms/contracts/offer-rail";

describe("parseCmsOfferRailData", () => {
  test("parses and orders timed and evergreen offers", () => {
    const result = parseCmsOfferRailData({
      ariaLabel: "Aktuelle Angebote",
      description: "Ausgewählte Preisvorteile.",
      eyebrow: "Nur für kurze Zeit",
      offers: [
        {
          ctaLabel: "Entdecken",
          image: { url: "/images/second.webp" },
          position: 2,
          title: "Dauerhafte Angebote",
          url: "/rabatt-angebote",
        },
        {
          ctaLabel: "Jetzt sparen",
          endsAt: "2026-09-30T23:59:59+02:00",
          id: "living-room-sale",
          image: {
            alt: "Wohnzimmer",
            url: "/images/first.webp",
          },
          legalText: "Gültig für ausgewählte Artikel.",
          position: 1,
          subtitle: "Bis zu 20 % Rabatt",
          title: "Wohnwochen",
          url: "/wohnzimmer",
        },
      ],
      title: "Aktuelle Aktionen",
    });

    expect(result.issues).toEqual([]);
    expect(result.data).toEqual({
      ariaLabel: "Aktuelle Angebote",
      description: "Ausgewählte Preisvorteile.",
      eyebrow: "Nur für kurze Zeit",
      offers: [
        {
          ctaLabel: "Jetzt sparen",
          endsAt: "2026-09-30T23:59:59+02:00",
          id: "living-room-sale",
          image: {
            alt: "Wohnzimmer",
            url: "/images/first.webp",
          },
          legalText: "Gültig für ausgewählte Artikel.",
          position: 1,
          subtitle: "Bis zu 20 % Rabatt",
          title: "Wohnwochen",
          url: "/wohnzimmer",
        },
        {
          ctaLabel: "Entdecken",
          endsAt: undefined,
          id: "Dauerhafte Angebote-0",
          image: {
            alt: "Dauerhafte Angebote",
            url: "/images/second.webp",
          },
          legalText: undefined,
          position: 2,
          subtitle: undefined,
          title: "Dauerhafte Angebote",
          url: "/rabatt-angebote",
        },
      ],
      title: "Aktuelle Aktionen",
    });
  });

  test("keeps an offer without a timer when its end date is invalid", () => {
    const result = parseCmsOfferRailData({
      offers: {
        sale: {
          ctaLabel: "Jetzt sparen",
          endsAt: "2026-09-30",
          image: { url: "/images/sale.webp" },
          title: "Sale",
          url: "/rabatt-angebote",
        },
      },
      title: "Aktionen",
    });

    expect(result.data?.offers[0]?.endsAt).toBeUndefined();
    expect(result.issues).toEqual([
      {
        message: "Offer end date must be an ISO timestamp with a timezone.",
        path: "offers.sale.endsAt",
      },
    ]);
  });

  test("rejects a rail without a valid offer", () => {
    const result = parseCmsOfferRailData({
      offers: [{ image: {}, title: "Incomplete" }],
      title: "Aktionen",
    });

    expect(result.data).toBeNull();
    expect(result.issues).toEqual([
      {
        message: "Offer is missing required fields: image.url, url, ctaLabel.",
        path: "offers.0",
      },
      {
        message: "At least one valid offer is required.",
        path: "offers",
      },
    ]);
  });
});
