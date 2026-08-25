import { getCmsRecord, getCmsString } from "@/lib/cms/contracts/parsing";

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

function parseRooms(value: unknown): CmsRoomGridItem[] {
  const roomsRecord = getCmsRecord(value);
  const roomValues = Array.isArray(value)
    ? value
    : roomsRecord
      ? Object.values(roomsRecord)
      : [];

  return roomValues
    .flatMap((roomValue, index) => {
      const room = getCmsRecord(roomValue);
      const image = getCmsRecord(room?.image);
      const imageUrl = getCmsString(image, "url");
      const label = getCmsString(room, "label");
      const title = getCmsString(room, "title");
      const url = getCmsString(room, "url");

      if (!imageUrl || !label || !title || !url) {
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
}

export function parseCmsRoomGridData(value: unknown): CmsRoomGridData | null {
  const data = getCmsRecord(value);
  const rooms = parseRooms(data?.rooms);
  const title = getCmsString(data, "title");

  if (!title || rooms.length === 0) {
    return null;
  }

  return {
    description: getCmsString(data, "description"),
    eyebrow: getCmsString(data, "eyebrow"),
    rooms,
    title,
  };
}
