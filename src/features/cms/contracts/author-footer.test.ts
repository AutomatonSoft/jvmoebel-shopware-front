import { describe, expect, test } from "bun:test";

import { parseCmsAuthorFooterData } from "@/features/cms/contracts/author-footer";

describe("parseCmsAuthorFooterData", () => {
  test("parses the Store API author footer contract", () => {
    const result = parseCmsAuthorFooterData({
      authorName: "Anna M.",
      bio: "Redaktion JVMöbel.",
      expertise: "Einrichtung",
      image: { alt: "Anna M.", url: "/media/author-anna.webp" },
      link: { label: "Profil", url: "/autor/anna" },
    });

    expect(result.data).toEqual({
      authorName: "Anna M.",
      bio: "Redaktion JVMöbel.",
      expertise: "Einrichtung",
      image: { alt: "Anna M.", url: "/media/author-anna.webp" },
      link: { label: "Profil", size: "medium", url: "/autor/anna" },
    });
    expect(result.issues).toEqual([]);
  });

  test("rejects an incomplete author footer", () => {
    const result = parseCmsAuthorFooterData({
      authorName: "Anna M.",
      bio: "Redaktion JVMöbel.",
      image: {},
      link: { label: "Profil" },
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "expertise",
      "image.url",
      "link",
    ]);
  });
});
