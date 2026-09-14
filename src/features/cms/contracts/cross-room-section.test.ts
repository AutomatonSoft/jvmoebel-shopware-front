import { describe, expect, test } from "bun:test";

import { parseCmsCrossRoomSectionData } from "@/features/cms/contracts/cross-room-section";

describe("parseCmsCrossRoomSectionData", () => {
  test("parses and sorts rooms from the Store API contract", () => {
    const result = parseCmsCrossRoomSectionData({
      eyebrow: "Shop by room",
      rooms: [
        {
          id: "bedroom",
          image: { url: "/media/room-bedroom.webp" },
          label: "Schlafzimmer",
          position: 2,
          title: "Betten & Schränke",
          url: "/schlafzimmer",
        },
        {
          description: "Gemütlich wohnen",
          id: "living",
          image: {
            alt: "Wohnzimmer",
            url: "/media/room-living.webp",
          },
          label: "Wohnzimmer",
          position: 0,
          title: "Sofas & Tische",
          url: "/wohnzimmer",
        },
      ],
      title: "Räume entdecken",
    });

    expect(result.data?.rooms.map((room) => room.id)).toEqual([
      "living",
      "bedroom",
    ]);
    expect(result.data?.rooms[0]?.description).toBe("Gemütlich wohnen");
    expect(result.issues).toEqual([]);
  });

  test("rejects a section without valid rooms", () => {
    const result = parseCmsCrossRoomSectionData({
      rooms: [{ image: {}, label: "Wohnzimmer" }],
      title: "Räume entdecken",
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "rooms.0.title",
      "rooms.0.url",
      "rooms.0.image.url",
      "rooms",
    ]);
  });
});
