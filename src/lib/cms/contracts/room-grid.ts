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

function getRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

function getString(record: Record<string, unknown> | undefined, key: string) {
  const value = record?.[key];

  return typeof value === "string" && value.trim() ? value : undefined;
}

function parseRooms(value: unknown): CmsRoomGridItem[] {
  const roomsRecord = getRecord(value);
  const roomValues = Array.isArray(value)
    ? value
    : roomsRecord
      ? Object.values(roomsRecord)
      : [];

  return roomValues
    .flatMap((roomValue, index) => {
      const room = getRecord(roomValue);
      const image = getRecord(room?.image);
      const imageUrl = getString(image, "url");
      const label = getString(room, "label");
      const title = getString(room, "title");
      const url = getString(room, "url");

      if (!imageUrl || !label || !title || !url) {
        return [];
      }

      const position = room?.position;

      return [
        {
          featured: room?.featured === true || room?.featured === 1,
          id: getString(room, "id") || `${label}-${index}`,
          image: {
            alt: getString(image, "alt") || "",
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
  const data = getRecord(value);
  const rooms = parseRooms(data?.rooms);
  const title = getString(data, "title");

  if (!title || rooms.length === 0) {
    return null;
  }

  return {
    description: getString(data, "description"),
    eyebrow: getString(data, "eyebrow"),
    rooms,
    title,
  };
}
