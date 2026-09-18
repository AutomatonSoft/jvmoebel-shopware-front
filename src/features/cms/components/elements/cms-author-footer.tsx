import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsElementProps } from "@/features/cms/components/cms-element";
import type { CmsAuthorFooterData } from "@/features/cms/contracts/author-footer";

export function CmsAuthorFooter({
  data,
}: CmsElementProps<CmsAuthorFooterData>) {
  const { authorName, bio, expertise, image, link } = data;

  return (
    <Container
      as="section"
      className="pt-12 sm:pt-16"
      data-cms-element="jv-author-footer"
    >
      <footer className="flex flex-col gap-5 border-y py-6 sm:flex-row sm:items-center sm:gap-6 sm:py-8">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-muted sm:size-24">
          <Image
            alt={image.alt}
            className="object-cover"
            fill
            sizes="96px"
            src={image.url}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            Autor · {expertise}
          </p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight">
            {authorName}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {bio}
          </p>
        </div>
        <CmsLink
          className="group inline-flex w-fit shrink-0 items-center gap-2 text-sm font-semibold underline decoration-primary/45 underline-offset-4 transition-colors hover:text-primary"
          href={link.url}
        >
          {link.label}
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
          />
        </CmsLink>
      </footer>
    </Container>
  );
}
