import { describe, expect, test } from "bun:test";

import {
  formatCountdownLabel,
  formatCountdownValue,
  getCountdownParts,
} from "@/features/offers/model/countdown";

describe("offer countdown", () => {
  test("calculates and formats the remaining duration", () => {
    const parts = getCountdownParts(
      "2026-09-15T07:00:00Z",
      Date.parse("2026-09-11T02:46:51Z"),
    );

    expect(parts).toEqual({ days: 4, hours: 4, minutes: 13, seconds: 9 });
    expect(parts && formatCountdownValue(parts)).toBe("04:04:13:09");
    expect(parts && formatCountdownLabel(parts)).toBe(
      "Nur noch 4 Tage, 4 Stunden, 13 Minuten und 9 Sekunden",
    );
  });

  test("rounds a partial final second up and stops at the deadline", () => {
    const endsAt = "2026-09-15T07:00:00Z";

    expect(
      getCountdownParts(endsAt, Date.parse("2026-09-15T06:59:59.500Z")),
    ).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 1 });
    expect(getCountdownParts(endsAt, Date.parse(endsAt))).toBeNull();
  });
});
