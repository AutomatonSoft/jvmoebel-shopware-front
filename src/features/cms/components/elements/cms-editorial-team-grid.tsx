import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsElementProps } from "@/features/cms/components/cms-element";
import type { CmsEditorialTeamGridData } from "@/features/cms/contracts/editorial-team-grid";

export function CmsEditorialTeamGrid({
  data,
}: CmsElementProps<CmsEditorialTeamGridData>) {
  const { members, title } = data;

  return (
    <Container
      as="section"
      className="pt-16 sm:pt-20"
      data-cms-element="jv-editorial-team-grid"
    >
      <h2 className="mb-8 text-3xl leading-none font-semibold tracking-[-0.04em] text-balance sm:mb-10 sm:text-4xl">
        {title}
      </h2>

      <ul className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {members.map((member) => (
          <li key={member.id}>
            <CmsLink
              aria-label={`${member.name}, ${member.role}`}
              className="group block rounded-2xl focus-visible:ring-3 focus-visible:ring-primary/25 focus-visible:ring-offset-4 focus-visible:outline-none"
              href={member.url}
            >
              <span className="relative block aspect-4/5 overflow-hidden rounded-2xl bg-muted">
                <Image
                  alt={member.image.alt}
                  className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  src={member.image.url}
                />
              </span>
              <span className="mt-4 flex items-start gap-4 px-1">
                <span className="min-w-0 flex-1">
                  <strong className="block text-lg leading-tight font-semibold tracking-tight sm:text-xl">
                    {member.name}
                  </strong>
                  <span className="mt-1.5 block text-sm text-muted-foreground">
                    {member.role}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="mt-1 size-5 shrink-0 text-primary transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                />
              </span>
            </CmsLink>
          </li>
        ))}
      </ul>
    </Container>
  );
}
