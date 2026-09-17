import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { parseCmsColorWorldPickerData } from "@/features/cms/contracts/color-world-picker";
import { reportCmsContractIssues } from "@/features/cms/server/report-rendering-issue";

export function CmsColorWorldPicker({ slot }: CmsSlotComponentProps) {
  const result = parseCmsColorWorldPickerData(slot.data);

  reportCmsContractIssues(slot, result.issues);

  if (!result.data) {
    return null;
  }

  const { colors, description, title } = result.data;

  return (
    <Container
      as="section"
      className="pt-16 sm:pt-20"
      data-cms-element="jv-color-world-picker"
    >
      <header className="mb-8 sm:mb-10">
        <h2 className="text-3xl leading-none font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </header>

      <ul className="-mx-4 grid snap-x snap-mandatory scroll-px-4 auto-cols-[76vw] grid-flow-col gap-4 overflow-x-auto px-4 pb-4 scrollbar-none sm:-mx-8 sm:scroll-px-8 sm:auto-cols-[40vw] sm:px-8 lg:mx-0 lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-4 lg:px-0 [&::-webkit-scrollbar]:hidden">
        {colors.map((color) => (
          <li className="snap-start" key={color.id}>
            <CmsLink
              className="group block rounded-2xl border bg-card p-2 shadow-[0_14px_36px_-30px_rgba(21,21,19,0.7)] focus-visible:ring-3 focus-visible:ring-primary/25 focus-visible:ring-offset-4 focus-visible:outline-none"
              href={color.url}
            >
              <span className="relative block aspect-4/5 overflow-hidden rounded-xl bg-muted">
                <Image
                  alt={color.image.alt}
                  className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.035]"
                  fill
                  sizes="(max-width: 640px) 76vw, (max-width: 1024px) 40vw, 25vw"
                  src={color.image.url}
                />
              </span>
              <span className="flex min-h-16 items-center gap-3 px-2 py-3">
                <span
                  aria-hidden="true"
                  className="size-7 shrink-0 rounded-full border border-foreground/10 shadow-inner"
                  style={{ backgroundColor: color.hex }}
                />
                <strong className="flex-1 text-sm font-semibold">
                  {color.name}
                </strong>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 text-primary transition-transform duration-300 motion-safe:group-hover:translate-x-1"
                />
              </span>
            </CmsLink>
          </li>
        ))}
      </ul>
    </Container>
  );
}
