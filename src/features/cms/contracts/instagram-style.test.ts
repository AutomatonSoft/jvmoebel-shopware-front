import { describe, expect, test } from "bun:test";

import { parseCmsInstagramStyleData } from "@/features/cms/contracts/instagram-style";

describe("parseCmsInstagramStyleData", () => {
  test("parses the Store API Instagram style contract", () => {
    const result = parseCmsInstagramStyleData({
      caption: "Neues aus dem Showroom",
      handle: "@jvmoebel",
      image: { alt: "Showroom", url: "/media/instagram.webp" },
      link: {
        label: "Folgen",
        url: "https://instagram.com/jvmoebel",
      },
    });

    expect(result.data).toEqual({
      caption: "Neues aus dem Showroom",
      handle: "@jvmoebel",
      image: { alt: "Showroom", url: "/media/instagram.webp" },
      link: {
        label: "Folgen",
        size: "medium",
        url: "https://instagram.com/jvmoebel",
      },
    });
    expect(result.issues).toEqual([]);
  });

  test("rejects incomplete Instagram content", () => {
    const result = parseCmsInstagramStyleData({
      handle: "@jvmoebel",
      image: {},
      link: { url: "https://instagram.com/jvmoebel" },
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "caption",
      "image.url",
      "link",
    ]);
  });
});
