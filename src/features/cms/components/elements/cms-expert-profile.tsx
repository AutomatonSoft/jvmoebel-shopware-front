import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsElementProps } from "@/features/cms/components/cms-element";
import type { CmsExpertProfileData } from "@/features/cms/contracts/expert-profile";

export function CmsExpertProfile({
  data,
}: CmsElementProps<CmsExpertProfileData>) {
  const { bio, image, link, name, role } = data;

  return (
    <Container
      as="section"
      className="pt-12 sm:pt-16"
      data-cms-element="jv-expert-profile"
    >
      <article className="grid overflow-hidden rounded-3xl border bg-card shadow-[0_20px_50px_-42px_rgba(21,21,19,0.65)] sm:grid-cols-[15rem_1fr] lg:grid-cols-[19rem_1fr]">
        <div className="relative min-h-72 bg-muted sm:min-h-80">
          <Image
            alt={image.alt}
            className="object-cover"
            fill
            sizes="(max-width: 640px) 100vw, 304px"
            src={image.url}
          />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            {role}
          </p>
          <h2 className="mt-3 text-3xl leading-none font-semibold tracking-[-0.04em] sm:text-4xl">
            {name}
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {bio}
          </p>
          <CmsLink
            className="group mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold underline decoration-primary/45 underline-offset-4 transition-colors hover:text-primary"
            href={link.url}
          >
            {link.label}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
            />
          </CmsLink>
        </div>
      </article>
    </Container>
  );
}
