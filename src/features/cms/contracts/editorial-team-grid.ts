import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import {
  addRequiredString,
  getCmsEntries,
  getCmsPosition,
  parseReferenceImage,
  type CmsReferenceImage,
} from "@/features/cms/contracts/reference-shared";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsEditorialTeamMember = Readonly<{
  id: string;
  image: CmsReferenceImage;
  name: string;
  position: number;
  role: string;
  url: string;
}>;

export type CmsEditorialTeamGridData = Readonly<{
  members: readonly CmsEditorialTeamMember[];
  title: string;
}>;

function parseMembers(
  value: unknown,
  issues: CmsContractIssue[],
): CmsEditorialTeamMember[] {
  return getCmsEntries(value)
    .flatMap(([key, memberValue], index) => {
      const member = getCmsRecord(memberValue);
      const path = `members.${key}`;
      const name = addRequiredString(member, "name", `${path}.name`, issues);
      const role = addRequiredString(member, "role", `${path}.role`, issues);
      const url = addRequiredString(member, "url", `${path}.url`, issues);
      const image = parseReferenceImage(
        member?.image,
        `${path}.image`,
        name || "",
        issues,
      );

      if (!name || !role || !url || !image) {
        return [];
      }

      return [
        {
          id: getCmsString(member, "id") || `${name}-${index}`,
          image,
          name,
          position: getCmsPosition(member, index),
          role,
          url,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);
}

export function parseCmsEditorialTeamGridData(
  value: unknown,
): CmsContractResult<CmsEditorialTeamGridData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const title = addRequiredString(record, "title", "title", issues);
  const members = parseMembers(record?.members, issues);

  if (members.length === 0) {
    issues.push({
      message: "At least one valid editorial team member is required.",
      path: "members",
    });
  }

  if (!title || members.length === 0) {
    return { data: null, issues };
  }

  return { data: { members, title }, issues };
}
