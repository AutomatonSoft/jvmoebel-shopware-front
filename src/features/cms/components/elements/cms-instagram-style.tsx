import { ArrowUpRight, Camera } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsInstagramStyleData } from "@/features/cms/contracts/instagram-style";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

export function CmsInstagramStyle({ slot }: CmsSlotComponentProps) {
  const result = parseCmsInstagramStyleData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const { caption, handle, image, link } = result.data;

  return (
    <Container
      as="section"
      className="pt-16 sm:pt-20"
      data-cms-element="jv-instagram-style"
    >
      <CmsLink
        aria-label={`${link.label}: ${handle}`}
        className="group grid overflow-hidden rounded-3xl border bg-card shadow-[0_22px_55px_-42px_rgba(21,21,19,0.7)] focus-visible:ring-3 focus-visible:ring-primary/25 focus-visible:ring-offset-4 focus-visible:outline-none md:grid-cols-[minmax(18rem,0.9fr)_minmax(0,1.1fr)]"
        href={link.url}
      >
        <span className="relative block aspect-square min-h-72 overflow-hidden bg-muted md:aspect-auto md:min-h-120">
          <Image
            alt={image.alt}
            className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.035]"
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            src={image.url}
          />
        </span>

        <span className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
          <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
            <Camera aria-hidden="true" className="size-6" />
          </span>
          <span className="mt-6 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            {handle}
          </span>
          <strong className="mt-3 block max-w-xl text-3xl leading-tight font-semibold tracking-[-0.045em] text-balance sm:text-4xl">
            {caption}
          </strong>
          <span className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold underline decoration-primary/45 underline-offset-4 transition-colors duration-300 group-hover:text-primary">
            {link.label}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1"
            />
          </span>
        </span>
      </CmsLink>
    </Container>
  );
}
