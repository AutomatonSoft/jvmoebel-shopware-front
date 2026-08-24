import { ArrowRight } from "lucide-react";
import Image from "next/image";

import type { CmsSlotComponentProps } from "@/components/cms/cms-page-renderer";

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

function getRooms(data: Record<string, unknown> | undefined) {
  const roomsValue = data?.rooms;
  const roomsRecord = getRecord(roomsValue);
  const roomValues = Array.isArray(roomsValue)
    ? roomsValue
    : roomsRecord
      ? Object.values(roomsRecord)
      : [];

  if (roomValues.length === 0) {
    return [];
  }

  return roomValues
    .flatMap((value, index) => {
      const room = getRecord(value);
      const image = getRecord(room?.image);
      const label = getString(room, "label");
      const title = getString(room, "title");
      const url = getString(room, "url");
      const imageUrl = getString(image, "url");

      if (!label || !title || !url || !imageUrl) {
        return [];
      }

      return [
        {
          featured: room?.featured === true || room?.featured === 1,
          id: getString(room, "id") || `${label}-${index}`,
          imageAlt: getString(image, "alt") || "",
          imageUrl,
          label,
          position: typeof room?.position === "number" ? room.position : index,
          title,
          url,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);
}

export function CmsRoomGrid({ slot }: CmsSlotComponentProps) {
  const data = getRecord(slot.data);
  const rooms = getRooms(data);
  const title = getString(data, "title");

  if (!title || rooms.length === 0) {
    return null;
  }

  const eyebrow = getString(data, "eyebrow");
  const description = getString(data, "description");

  return (
    <section
      className="mx-auto w-full max-w-360 px-4 py-20 sm:px-8 sm:py-28"
      data-cms-element="jv-room-grid"
    >
      <div className="mb-10 grid gap-6 md:grid-cols-[1fr_minmax(16rem,28rem)] md:items-end">
        <div>
          {eyebrow && (
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] uppercase before:block before:size-2 before:bg-primary">
              {eyebrow}
            </p>
          )}
          <h2 className="max-w-3xl text-4xl leading-none font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
            {title}
          </h2>
        </div>
        {description && (
          <p className="text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-[1.44fr_1fr] md:grid-rows-[repeat(2,20.625rem)]">
        {rooms.map((room, index) => (
          <a
            className={`group relative min-h-96 overflow-hidden rounded-2xl bg-foreground text-white shadow-[0_0_0_1px_rgba(21,21,19,0.04)] md:min-h-0 ${room.featured ? "md:row-span-2" : ""}`}
            href={room.url}
            key={room.id}
          >
            <Image
              alt={room.imageAlt}
              className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.035]"
              fill
              sizes={
                room.featured
                  ? "(max-width: 768px) 100vw, 58vw"
                  : "(max-width: 768px) 100vw, 40vw"
              }
              src={room.imageUrl}
            />
            <span className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 grid grid-cols-[1fr_auto] items-end gap-2 p-5 sm:p-7">
              <small className="col-start-1 text-[0.625rem] tracking-[0.12em] text-white/70 uppercase">
                {String(index + 1).padStart(2, "0")} / {room.label}
              </small>
              <strong className="col-start-1 text-2xl leading-tight font-medium tracking-[-0.04em] sm:text-3xl">
                {room.title}
              </strong>
              <span className="col-start-2 row-span-2 row-start-1 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-[background,color,transform] group-hover:bg-accent group-hover:text-accent-foreground motion-safe:group-hover:-rotate-8">
                <ArrowRight className="size-5" />
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
