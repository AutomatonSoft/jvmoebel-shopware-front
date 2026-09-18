import { Container } from "@/components/ui/container";
import type { CmsElementProps } from "@/features/cms/components/cms-element";
import type { CmsNewsletterData } from "@/features/cms/contracts/newsletter";
import { NewsletterForm } from "@/features/newsletter/components/newsletter-form";

export function CmsNewsletter({ data }: CmsElementProps<CmsNewsletterData>) {
  const {
    buttonLabel,
    buttonSize,
    description,
    errorMessage,
    eyebrow,
    invalidEmailMessage,
    placeholder,
    successMessage,
    title,
  } = data;

  return (
    <Container
      as="section"
      className="my-2 sm:my-6"
      data-cms-element="jv-newsletter"
    >
      <div className="overflow-hidden rounded-3xl border border-[#cbbdad] bg-[#ded2c4]">
        <div className="grid items-center gap-10 px-4 py-16 sm:px-8 lg:grid-cols-2 lg:gap-20">
          <div>
            {eyebrow && (
              <p className="mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] uppercase before:block before:size-2 before:bg-primary">
                {eyebrow}
              </p>
            )}
            <h2 className="max-w-xl text-4xl leading-none font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
              {title}
            </h2>
          </div>
          <div>
            <p className="mb-5 max-w-xl text-sm leading-7 sm:text-base">
              {description}
            </p>
            <NewsletterForm
              buttonLabel={buttonLabel}
              buttonSize={buttonSize}
              errorMessage={errorMessage}
              invalidEmailMessage={invalidEmailMessage}
              placeholder={placeholder}
              successMessage={successMessage}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
