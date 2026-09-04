import { describe, expect, test } from "bun:test";

import { parseCmsWhyJvmoebelData } from "@/features/cms/contracts/why-jvmoebel";

describe("parseCmsWhyJvmoebelData", () => {
  test("parses and sorts benefits", () => {
    const result = parseCmsWhyJvmoebelData({
      benefits: {
        advice: {
          description: "Persönliche Hilfe bei der Auswahl.",
          icon: "advice",
          position: 2,
          title: "Persönliche Beratung",
          url: "/kontakt",
        },
        design: {
          description: "Ausdrucksstarke Formen und Materialien.",
          icon: "design",
          id: "selected-design",
          position: 0,
          title: "Ausgewählte Designs",
          url: "/shop",
        },
      },
      mark: "JVM",
      tagline: "Für Räume mit Persönlichkeit",
      title: "Warum JVMöbel?",
      viewAll: { label: "Mehr über JVMöbel", url: "/ueber-uns" },
    });

    expect(result.data?.benefits.map((benefit) => benefit.id)).toEqual([
      "selected-design",
      "Persönliche Beratung-0",
    ]);
    expect(result.data?.viewAll).toEqual({
      label: "Mehr über JVMöbel",
      url: "/ueber-uns",
    });
    expect(result.issues).toEqual([]);
  });

  test("omits invalid benefits and incomplete links", () => {
    const result = parseCmsWhyJvmoebelData({
      benefits: [
        {
          description: "Unbekanntes Symbol.",
          icon: "unknown",
          title: "Ungültiger Vorteil",
          url: "/invalid",
        },
        {
          description: "Vertraute Zahlungsarten.",
          icon: "payment",
          position: Number.NaN,
          title: "Sicher bezahlen",
          url: "/zahlungsarten",
        },
      ],
      mark: "JVM",
      tagline: "Für Räume mit Persönlichkeit",
      title: "Warum JVMöbel?",
      viewAll: { label: "Mehr über JVMöbel" },
    });

    expect(result.data?.benefits).toHaveLength(1);
    expect(result.data?.benefits[0]?.position).toBe(1);
    expect(result.data?.viewAll).toBeUndefined();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "benefits.0",
      "viewAll",
    ]);
  });

  test("rejects content without its required fields", () => {
    const result = parseCmsWhyJvmoebelData({ benefits: [] });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "benefits",
      "mark",
      "tagline",
      "title",
    ]);
  });
});
