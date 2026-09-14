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

export type CmsCrossRoom = Readonly<{
  description?: string;
  id: string;
  image: CmsReferenceImage;
  label: string;
  position: number;
  title: string;
  url: string;
}>;

export type CmsCrossRoomSectionData = Readonly<{
  eyebrow?: string;
  rooms: readonly CmsCrossRoom[];
  title: string;
}>;

function parseRooms(
  value: unknown,
  issues: CmsContractIssue[],
): CmsCrossRoom[] {
  return getCmsEntries(value)
    .flatMap(([key, roomValue], index) => {
      const room = getCmsRecord(roomValue);
      const path = `rooms.${key}`;
      const label = addRequiredString(room, "label", `${path}.label`, issues);
      const title = addRequiredString(room, "title", `${path}.title`, issues);
      const url = addRequiredString(room, "url", `${path}.url`, issues);
      const image = parseReferenceImage(
        room?.image,
        `${path}.image`,
        title || label || "",
        issues,
      );

      if (!label || !title || !url || !image) {
        return [];
      }

      return [
        {
          description: getCmsString(room, "description"),
          id: getCmsString(room, "id") || `${label}-${index}`,
          image,
          label,
          position: getCmsPosition(room, index),
          title,
          url,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);
}

export function parseCmsCrossRoomSectionData(
  value: unknown,
): CmsContractResult<CmsCrossRoomSectionData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const title = addRequiredString(record, "title", "title", issues);
  const rooms = parseRooms(record?.rooms, issues);

  if (rooms.length === 0) {
    issues.push({
      message: "At least one valid room is required.",
      path: "rooms",
    });
  }

  if (!title || rooms.length === 0) {
    return { data: null, issues };
  }

  return {
    data: {
      eyebrow: getCmsString(record, "eyebrow"),
      rooms,
      title,
    },
    issues,
  };
}
