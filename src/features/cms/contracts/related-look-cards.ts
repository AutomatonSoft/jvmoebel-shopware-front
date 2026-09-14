import { getCmsRecord } from "@/features/cms/contracts/parsing";
import {
  addRequiredString,
  parseReferenceCards,
  type CmsReferenceCard,
} from "@/features/cms/contracts/reference-shared";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsRelatedLookCardsData = Readonly<{
  cards: readonly CmsReferenceCard[];
  title: string;
}>;

export function parseCmsRelatedLookCardsData(
  value: unknown,
): CmsContractResult<CmsRelatedLookCardsData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const title = addRequiredString(record, "title", "title", issues);
  const cards = parseReferenceCards(record?.cards, "cards", issues);

  if (cards.length === 0) {
    issues.push({
      message: "At least one valid related look card is required.",
      path: "cards",
    });
  }

  if (!title || cards.length === 0) {
    return { data: null, issues };
  }

  return {
    data: { cards, title },
    issues,
  };
}
