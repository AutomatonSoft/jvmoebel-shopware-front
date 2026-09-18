import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

const gallerySkeletons = Array.from({ length: 4 }, (_, index) => index);
const relatedProductSkeletons = Array.from({ length: 5 }, (_, index) => index);

function RelatedProductSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="flex min-w-0 flex-col overflow-hidden rounded-[1.4rem] border border-foreground/10 bg-card shadow-[0_16px_45px_-34px_rgba(21,21,19,0.7)]"
    >
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <Skeleton className="h-3 w-18" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-4/5" />
        <Skeleton className="mt-10 h-6 w-28" />
        <div className="mt-auto flex items-center justify-between border-t border-foreground/8 pt-3">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
        </div>
      </div>
    </article>
  );
}

export function ProductDetailLoading() {
  return (
    <main aria-busy="true" aria-label="Produkt wird geladen" className="flex-1">
      <Container className="py-6">
        <nav
          aria-hidden="true"
          className="flex flex-wrap items-center gap-2.5 text-[0.625rem]"
        >
          <Skeleton className="h-3 w-10" />
          <Skeleton className="size-1 rounded-full" />
          <Skeleton className="h-3 w-10" />
          <Skeleton className="size-1 rounded-full" />
          <Skeleton className="h-3 w-48" />
        </nav>

        <section className="grid gap-8 py-8 sm:py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(32rem,1.1fr)] lg:items-start lg:gap-10 xl:gap-12">
          <div aria-hidden="true" className="lg:sticky lg:top-24">
            <div className="grid min-w-0 gap-3 sm:grid-cols-[5rem_minmax(0,1fr)]">
              <div className="order-2 flex gap-2 overflow-hidden pb-1 sm:order-1 sm:flex-col sm:pb-0">
                {gallerySkeletons.map((index) => (
                  <Skeleton
                    className="aspect-square w-18 shrink-0 rounded-xl sm:w-full"
                    key={index}
                  />
                ))}
              </div>
              <Skeleton className="order-1 aspect-[0.92] min-w-0 rounded-2xl sm:order-2" />
            </div>
          </div>

          <aside aria-hidden="true" className="min-w-0 lg:sticky lg:top-24">
            <header className="border-b pb-6">
              <Skeleton className="h-9 w-full sm:h-10" />
              <Skeleton className="mt-2 h-9 w-4/5 sm:h-10" />
              <Skeleton className="mt-4 h-4 w-24" />
              <Skeleton className="mt-6 h-10 w-40" />
              <Skeleton className="mt-3 h-3 w-36" />
            </header>

            <section className="border-b py-5">
              <Skeleton className="h-4 w-28" />
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <Skeleton className="mt-4 h-3 w-44" />
            </section>

            <section className="space-y-2 border-b py-5">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </section>

            <section className="border-b py-6">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-3/4" />
              <Skeleton className="mt-4 h-11 w-full rounded-xl" />
              <Skeleton className="mt-3 h-20 w-full rounded-xl" />
            </section>

            <Skeleton className="mt-5 h-12 w-full rounded-xl" />
            <Skeleton className="mt-2 h-11 w-full rounded-xl" />
          </aside>
        </section>

        <section aria-hidden="true" className="space-y-4 py-12 sm:py-16">
          <header className="mb-8 max-w-3xl">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-3 h-9 w-80 sm:h-10" />
          </header>
          <div className="overflow-hidden rounded-2xl border bg-card">
            <section className="border-b p-5 sm:p-7">
              <Skeleton className="h-6 w-56" />
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <Skeleton className="h-24 w-full rounded-xl" key={index} />
                ))}
              </div>
            </section>
            <section className="p-5 sm:p-7">
              <Skeleton className="h-6 w-52" />
              <div className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }, (_, index) => (
                  <Skeleton
                    className="h-14 w-full border-t bg-transparent"
                    key={index}
                  />
                ))}
              </div>
            </section>
          </div>
        </section>

        <section aria-hidden="true" className="border-t py-16 sm:py-20">
          <div className="mb-9 flex items-end justify-between gap-6 sm:mb-11">
            <div>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-4 h-9 w-72 sm:h-10" />
            </div>
            <Skeleton className="hidden h-4 w-28 sm:block" />
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-3 md:gap-x-4 lg:grid-cols-4 xl:grid-cols-5">
            {relatedProductSkeletons.map((index) => (
              <RelatedProductSkeleton key={index} />
            ))}
          </div>
        </section>
      </Container>
      <span className="sr-only" role="status">
        Produkt wird geladen...
      </span>
    </main>
  );
}
