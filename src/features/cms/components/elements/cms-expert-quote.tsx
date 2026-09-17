import { Quote } from "lucide-react";

import { Container } from "@/components/ui/container";
import type { CmsElementProps } from "@/features/cms/components/cms-element";
import type { CmsExpertQuoteData } from "@/features/cms/contracts/expert-quote";

export function CmsExpertQuote({ data }: CmsElementProps<CmsExpertQuoteData>) {
  const { authorName, authorRole, quote } = data;

  return (
    <Container
      as="section"
      className="pt-12 sm:pt-16"
      data-cms-element="jv-expert-quote"
    >
      <blockquote className="relative overflow-hidden rounded-3xl bg-secondary px-6 py-10 text-center sm:px-12 sm:py-14">
        <Quote
          aria-hidden="true"
          className="mx-auto size-9 fill-primary text-primary"
        />
        <p className="mx-auto mt-6 max-w-4xl text-2xl leading-tight font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
          „{quote}“
        </p>
        <footer className="mt-7 text-sm">
          <cite className="font-semibold not-italic">{authorName}</cite>
          <span aria-hidden="true" className="mx-2 text-primary">
            ·
          </span>
          <span className="text-muted-foreground">{authorRole}</span>
        </footer>
      </blockquote>
    </Container>
  );
}
