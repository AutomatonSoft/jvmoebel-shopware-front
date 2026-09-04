import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsHomeEditorialSection = Readonly<{
  id: string;
  paragraphs: readonly string[];
  position: number;
  title?: string;
}>;

export type CmsHomeEditorialData = Readonly<{
  introduction: readonly string[];
  sections: readonly CmsHomeEditorialSection[];
  showLessLabel: string;
  showMoreLabel: string;
  statement: string;
  title: string;
}>;

function parseParagraphs(
  value: unknown,
  path: string,
): Readonly<{
  data: string[];
  issues: readonly CmsContractIssue[];
}> {
  const paragraphsRecord = getCmsRecord(value);
  const paragraphEntries = Array.isArray(value)
    ? value.map((paragraph, index) => [String(index), paragraph] as const)
    : paragraphsRecord
      ? Object.entries(paragraphsRecord)
      : [];
  const issues: CmsContractIssue[] = [];

  const paragraphs = paragraphEntries.flatMap(([key, paragraph]) => {
    if (typeof paragraph !== "string" || !paragraph.trim()) {
      issues.push({
        message: "Paragraph is missing or empty.",
        path: `${path}.${key}`,
      });

      return [];
    }

    return [paragraph];
  });

  return { data: paragraphs, issues };
}

function parseSections(value: unknown): Readonly<{
  data: CmsHomeEditorialSection[];
  issues: readonly CmsContractIssue[];
}> {
  const sectionsRecord = getCmsRecord(value);
  const sectionEntries = Array.isArray(value)
    ? value.map((section, index) => [String(index), section] as const)
    : sectionsRecord
      ? Object.entries(sectionsRecord)
      : [];
  const issues: CmsContractIssue[] = [];

  const sections = sectionEntries
    .flatMap(([key, sectionValue], index) => {
      const section = getCmsRecord(sectionValue);
      const paragraphs = parseParagraphs(
        section?.paragraphs,
        `sections.${key}.paragraphs`,
      );

      issues.push(...paragraphs.issues);

      if (!section || paragraphs.data.length === 0) {
        issues.push({
          message: "At least one valid paragraph is required.",
          path: `sections.${key}.paragraphs`,
        });

        return [];
      }

      const position = section.position;

      return [
        {
          id: getCmsString(section, "id") || key,
          paragraphs: paragraphs.data,
          position:
            typeof position === "number" && Number.isFinite(position)
              ? position
              : index,
          title: getCmsString(section, "title"),
        },
      ];
    })
    .sort((first, second) => first.position - second.position);

  return { data: sections, issues };
}

export function parseCmsHomeEditorialData(
  value: unknown,
): CmsContractResult<CmsHomeEditorialData> {
  const data = getCmsRecord(value);
  const introduction = parseParagraphs(data?.introduction, "introduction");
  const sections = parseSections(data?.sections);
  const showLessLabel = getCmsString(data, "showLessLabel");
  const showMoreLabel = getCmsString(data, "showMoreLabel");
  const statement = getCmsString(data, "statement");
  const title = getCmsString(data, "title");
  const issues: CmsContractIssue[] = [
    ...introduction.issues,
    ...sections.issues,
  ];

  if (introduction.data.length === 0) {
    issues.push({
      message: "At least one valid introduction paragraph is required.",
      path: "introduction",
    });
  }

  if (sections.data.length === 0) {
    issues.push({
      message: "At least one valid editorial section is required.",
      path: "sections",
    });
  }

  const requiredStrings = [
    ["showLessLabel", showLessLabel],
    ["showMoreLabel", showMoreLabel],
    ["statement", statement],
    ["title", title],
  ] as const;

  for (const [path, field] of requiredStrings) {
    if (!field) {
      issues.push({ message: "Value is missing or empty.", path });
    }
  }

  if (
    !showLessLabel ||
    !showMoreLabel ||
    !statement ||
    !title ||
    introduction.data.length === 0 ||
    sections.data.length === 0
  ) {
    return { data: null, issues };
  }

  return {
    data: {
      introduction: introduction.data,
      sections: sections.data,
      showLessLabel,
      showMoreLabel,
      statement,
      title,
    },
    issues,
  };
}
