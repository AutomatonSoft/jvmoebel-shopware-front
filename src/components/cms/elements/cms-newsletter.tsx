import type { CmsSlotComponentProps } from "@/components/cms/cms-page-renderer";
import { NewsletterForm } from "@/components/storefront/newsletter-form";
import { resolveCmsButtonSize } from "@/lib/cms/button-size";

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

export function CmsNewsletter({ slot }: CmsSlotComponentProps) {
  const data = getRecord(slot.data);
  const title = getString(data, "title");
  const description = getString(data, "description");
  const buttonLabel = getString(data, "buttonLabel");
  const errorMessage = getString(data, "errorMessage");
  const invalidEmailMessage = getString(data, "invalidEmailMessage");
  const placeholder = getString(data, "placeholder");
  const storefrontUrl = getString(data, "storefrontUrl");
  const successMessage = getString(data, "successMessage");

  if (
    !title ||
    !description ||
    !buttonLabel ||
    !errorMessage ||
    !invalidEmailMessage ||
    !placeholder ||
    !storefrontUrl ||
    !successMessage
  ) {
    return null;
  }

  const eyebrow = getString(data, "eyebrow");

  return (
    <section
      className="mx-2 my-2 overflow-hidden rounded-3xl border border-[#cbbdad] bg-[#ded2c4] sm:mx-6 sm:my-6"
      data-cms-element="jv-newsletter"
    >
      <div className="mx-auto grid w-full max-w-360 items-center gap-10 px-6 py-16 sm:px-10 lg:grid-cols-2 lg:gap-20">
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
            buttonSize={resolveCmsButtonSize(data?.buttonSize)}
            errorMessage={errorMessage}
            invalidEmailMessage={invalidEmailMessage}
            placeholder={placeholder}
            storefrontUrl={storefrontUrl}
            successMessage={successMessage}
          />
        </div>
      </div>
    </section>
  );
}
