import { ArrowRight } from "lucide-react";
import Image from "next/image";

import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsRoomGridData } from "@/features/cms/contracts/room-grid";

export function CmsRoomGrid({ slot }: CmsSlotComponentProps) {
  const data = parseCmsRoomGridData(slot.data);

  if (!data) {
    return null;
  }

  const { description, eyebrow, rooms, title } = data;

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
              alt={room.image.alt}
              className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.035]"
              fill
              sizes={
                room.featured
                  ? "(max-width: 768px) 100vw, 58vw"
                  : "(max-width: 768px) 100vw, 40vw"
              }
              src={room.image.url}
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
