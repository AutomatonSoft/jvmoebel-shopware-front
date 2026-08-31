import { describe, expect, test } from "bun:test";

import { parseCmsRoomGridData } from "@/features/cms/contracts/room-grid";

describe("parseCmsRoomGridData", () => {
  test("parses and sorts room items from an object", () => {
    const data = parseCmsRoomGridData({
      description: "Browse furniture by room.",
      rooms: {
        bedroom: {
          image: { url: "/images/bedroom.webp" },
          label: "Bedroom",
          position: 2,
          title: "Beds and wardrobes",
          url: "/bedroom",
        },
        livingRoom: {
          featured: 1,
          id: "living-room",
          image: {
            alt: "Contemporary living room",
            url: "/images/living.webp",
          },
          label: "Living room",
          position: 0,
          title: "Sofas and armchairs",
          url: "/living",
        },
      },
      title: "Furniture for every room",
    });

    expect(data?.rooms.map((room) => room.id)).toEqual([
      "living-room",
      "Bedroom-0",
    ]);
    expect(data?.rooms[0]).toEqual({
      featured: true,
      id: "living-room",
      image: {
        alt: "Contemporary living room",
        url: "/images/living.webp",
      },
      label: "Living room",
      position: 0,
      title: "Sofas and armchairs",
      url: "/living",
    });
  });

  test("omits invalid room items", () => {
    const data = parseCmsRoomGridData({
      rooms: [
        {
          image: {},
          label: "Missing image",
          title: "Invalid room",
          url: "/invalid",
        },
        {
          image: { url: "/images/valid.webp" },
          label: "Valid",
          position: Number.NaN,
          title: "Valid room",
          url: "/valid",
        },
      ],
      title: "Rooms",
    });

    expect(data?.rooms).toHaveLength(1);
    expect(data?.rooms[0]?.position).toBe(1);
  });

  test("rejects a grid without a title or valid rooms", () => {
    expect(parseCmsRoomGridData({ rooms: [] })).toBeNull();
    expect(parseCmsRoomGridData({ title: "Rooms", rooms: [] })).toBeNull();
  });
});
