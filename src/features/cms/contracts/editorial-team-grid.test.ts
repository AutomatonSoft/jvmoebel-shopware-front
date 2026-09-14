import { describe, expect, test } from "bun:test";

import { parseCmsEditorialTeamGridData } from "@/features/cms/contracts/editorial-team-grid";

describe("parseCmsEditorialTeamGridData", () => {
  test("parses and sorts the Store API editorial team members", () => {
    const result = parseCmsEditorialTeamGridData({
      members: [
        {
          id: "max",
          image: { url: "/media/team-max.webp" },
          name: "Max Becker",
          position: 2,
          role: "Fotografie",
          url: "/team/max",
        },
        {
          id: "anna",
          image: {
            alt: "Anna Müller",
            url: "/media/team-anna.webp",
          },
          name: "Anna Müller",
          position: 0,
          role: "Redaktion",
          url: "/team/anna",
        },
      ],
      title: "Unser Team",
    });

    expect(result.data?.members.map((member) => member.id)).toEqual([
      "anna",
      "max",
    ]);
    expect(result.data?.members[0]?.image.alt).toBe("Anna Müller");
    expect(result.issues).toEqual([]);
  });

  test("rejects a grid without valid team members", () => {
    const result = parseCmsEditorialTeamGridData({
      members: [{ image: {}, name: "Anna Müller" }],
      title: "Unser Team",
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "members.0.role",
      "members.0.url",
      "members.0.image.url",
      "members",
    ]);
  });
});
