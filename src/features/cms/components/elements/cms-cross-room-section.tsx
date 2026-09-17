import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsElementProps } from "@/features/cms/components/cms-element";
import type { CmsCrossRoomSectionData } from "@/features/cms/contracts/cross-room-section";

export function CmsCrossRoomSection({
  data,
}: CmsElementProps<CmsCrossRoomSectionData>) {
  const { eyebrow, rooms, title } = data;

  return (
    <Container
      as="section"
      className="pt-16 sm:pt-20"
      data-cms-element="jv-cross-room-section"
    >
      <header className="mb-8 sm:mb-10">
        {eyebrow && (
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase before:block before:size-2 before:bg-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl leading-none font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
          {title}
        </h2>
      </header>

      <ul className="-mx-4 grid snap-x snap-mandatory scroll-px-4 auto-cols-[84vw] grid-flow-col gap-4 overflow-x-auto px-4 pb-4 scrollbar-none sm:-mx-8 sm:scroll-px-8 sm:auto-cols-[48vw] sm:px-8 lg:mx-0 lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-3 lg:px-0 [&::-webkit-scrollbar]:hidden">
        {rooms.map((room) => (
          <li className="snap-start" key={room.id}>
            <CmsLink
              className="group relative isolate block min-h-112 overflow-hidden rounded-2xl bg-muted text-white focus-visible:ring-3 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none sm:min-h-128"
              href={room.url}
            >
              <Image
                alt={room.image.alt}
                className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.035]"
                fill
                sizes="(max-width: 640px) 84vw, (max-width: 1024px) 48vw, 33vw"
                src={room.image.url}
              />
              <span className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <span className="text-xs font-semibold tracking-[0.14em] text-white/75 uppercase">
                  {room.label}
                </span>
                <span className="mt-2 flex items-end gap-4">
                  <span className="min-w-0 flex-1">
                    <strong className="block text-2xl leading-tight font-semibold tracking-[-0.035em] sm:text-3xl">
                      {room.title}
                    </strong>
                    {room.description && (
                      <span className="mt-2 block text-sm leading-6 text-white/80">
                        {room.description}
                      </span>
                    )}
                  </span>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 motion-safe:group-hover:translate-x-1">
                    <ArrowRight aria-hidden="true" className="size-5" />
                  </span>
                </span>
              </span>
            </CmsLink>
          </li>
        ))}
      </ul>
    </Container>
  );
}
