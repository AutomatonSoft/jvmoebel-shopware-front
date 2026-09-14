import { describe, expect, test } from "bun:test";

import { parseCmsCountdownPromoData } from "@/features/cms/contracts/countdown-promo";

describe("parseCmsCountdownPromoData", () => {
  test("parses the Store API countdown promo contract", () => {
    const result = parseCmsCountdownPromoData({
      apiAlias: "cms_jv_countdown_promo",
      description: "Bis zu 40 % auf Sofas",
      endsAt: "2026-12-31T23:59:59+01:00",
      eyebrow: "Nur bis Sonntag",
      link: {
        apiAlias: "cms_jv_countdown_promo_link",
        label: "Jetzt shoppen",
        size: "medium",
        url: "/sale",
      },
      promoCode: "HOMIE40",
      title: "Homie Days",
    });

    expect(result.data).toEqual({
      description: "Bis zu 40 % auf Sofas",
      endsAt: "2026-12-31T23:59:59+01:00",
      eyebrow: "Nur bis Sonntag",
      link: {
        label: "Jetzt shoppen",
        size: "medium",
        url: "/sale",
      },
      promoCode: "HOMIE40",
      title: "Homie Days",
    });
    expect(result.issues).toEqual([]);
  });

  test("rejects an invalid deadline and incomplete link", () => {
    const result = parseCmsCountdownPromoData({
      endsAt: "not-a-date",
      link: { label: "Jetzt shoppen" },
      title: "Homie Days",
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "link",
      "endsAt",
    ]);
  });
});
