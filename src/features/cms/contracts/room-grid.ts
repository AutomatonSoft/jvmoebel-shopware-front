import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsRoomGridImage = Readonly<{
  alt: string;
  url: string;
}>;

export type CmsRoomGridItem = Readonly<{
  featured: boolean;
  id: string;
  image: CmsRoomGridImage;
  label: string;
  position: number;
  title: string;
  url: string;
}>;

export type CmsRoomGridData = Readonly<{
  description?: string;
  eyebrow?: string;
  rooms: readonly CmsRoomGridItem[];
  title: string;
}>;

function parseRooms(value: unknown): Readonly<{
  data: CmsRoomGridItem[];
  issues: readonly CmsContractIssue[];
}> {
  const roomsRecord = getCmsRecord(value);
  const roomEntries = Array.isArray(value)
    ? value.map((room, index) => [String(index), room] as const)
    : roomsRecord
      ? Object.entries(roomsRecord)
      : [];
  const issues: CmsContractIssue[] = [];

  const rooms = roomEntries
    .flatMap(([key, roomValue], index) => {
      const room = getCmsRecord(roomValue);
      const image = getCmsRecord(room?.image);
      const imageUrl = getCmsString(image, "url");
      const label = getCmsString(room, "label");
      const title = getCmsString(room, "title");
      const url = getCmsString(room, "url");
      const missingFields = [
        !imageUrl && "image.url",
        !label && "label",
        !title && "title",
        !url && "url",
      ].filter((field): field is string => Boolean(field));

      if (!imageUrl || !label || !title || !url) {
        issues.push({
          message: `Room is missing required fields: ${missingFields.join(", ")}.`,
          path: `rooms.${key}`,
        });

        return [];
      }

      const position = room?.position;

      return [
        {
          featured: room?.featured === true || room?.featured === 1,
          id: getCmsString(room, "id") || `${label}-${index}`,
          image: {
            alt: getCmsString(image, "alt") || "",
            url: imageUrl,
          },
          label,
          position:
            typeof position === "number" && Number.isFinite(position)
              ? position
              : index,
          title,
          url,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);

  return { data: rooms, issues };
}

export function parseCmsRoomGridData(
  value: unknown,
): CmsContractResult<CmsRoomGridData> {
  const data = getCmsRecord(value);
  const rooms = parseRooms(data?.rooms);
  const title = getCmsString(data, "title");
  const issues: CmsContractIssue[] = [...rooms.issues];

  if (!title) {
    issues.push({ message: "Title is missing or empty.", path: "title" });
  }

  if (rooms.data.length === 0) {
    issues.push({
      message: "At least one valid room is required.",
      path: "rooms",
    });
  }

  if (!title || rooms.data.length === 0) {
    return { data: null, issues };
  }

  return {
    data: {
      description: getCmsString(data, "description"),
      eyebrow: getCmsString(data, "eyebrow"),
      rooms: rooms.data,
      title,
    },
    issues,
  };
}
