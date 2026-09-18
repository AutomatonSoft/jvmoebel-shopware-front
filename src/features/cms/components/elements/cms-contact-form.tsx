import { Container } from "@/components/ui/container";
import { ContactForm } from "@/features/contact/components/contact-form";
import type { CmsElementProps } from "@/features/cms/components/cms-element";
import type { CmsContactFormData } from "@/features/cms/contracts/contact-form";

export function CmsContactForm({ data }: CmsElementProps<CmsContactFormData>) {
  return (
    <Container as="section" className="py-8 sm:py-12" data-cms-element="form">
      <div className="mx-auto max-w-3xl rounded-3xl border bg-card p-5 shadow-[0_24px_70px_-58px_rgba(21,21,19,0.7)] sm:p-8">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
          {data.title}
        </h2>
        <div className="mt-6">
          <ContactForm title={data.title} />
        </div>
      </div>
    </Container>
  );
}
