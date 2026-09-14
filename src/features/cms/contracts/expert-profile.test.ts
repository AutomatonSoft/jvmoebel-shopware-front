import { describe, expect, test } from "bun:test";

import { parseCmsExpertProfileData } from "@/features/cms/contracts/expert-profile";

describe("parseCmsExpertProfileData", () => {
  test("parses the Store API expert profile contract", () => {
    const result = parseCmsExpertProfileData({
      bio: "15 Jahre Erfahrung.",
      image: { alt: "Anna Müller", url: "/media/expert-anna.webp" },
      link: { label: "Mehr erfahren", url: "/experten/anna" },
      name: "Anna Müller",
      role: "Einrichtungsexpertin",
    });

    expect(result.data).toEqual({
      bio: "15 Jahre Erfahrung.",
      image: { alt: "Anna Müller", url: "/media/expert-anna.webp" },
      link: {
        label: "Mehr erfahren",
        size: "medium",
        url: "/experten/anna",
      },
      name: "Anna Müller",
      role: "Einrichtungsexpertin",
    });
    expect(result.issues).toEqual([]);
  });

  test("rejects an incomplete expert profile", () => {
    const result = parseCmsExpertProfileData({
      bio: "15 Jahre Erfahrung.",
      image: {},
      name: "Anna Müller",
      role: "Einrichtungsexpertin",
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "image.url",
      "link",
    ]);
  });
});
