import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

const productSkeletons = Array.from({ length: 8 }, (_, index) => index);
const filterSkeletons = Array.from({ length: 4 }, (_, index) => index);

function ProductCardSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="flex min-w-0 flex-col overflow-hidden rounded-[1.4rem] border border-foreground/10 bg-card shadow-[0_16px_45px_-34px_rgba(21,21,19,0.7)]"
    >
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="mb-2 flex min-h-4 items-center justify-between gap-2">
          <Skeleton className="h-3 w-18" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-4/5" />
        <Skeleton className="mt-10 h-6 w-28" />
        <div className="mt-auto flex min-h-9 items-center justify-between border-t border-foreground/8 pt-3">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
        </div>
      </div>
    </article>
  );
}

export default function FurnitureRangeLoading() {
  return (
    <main aria-busy="true" aria-label="Katalog wird geladen" className="flex-1">
      <Container className="pb-20 sm:pb-28">
        <nav
          aria-hidden="true"
          className="flex items-center gap-2.5 pt-6 text-[0.625rem]"
        >
          <Skeleton className="h-3 w-11" />
          <Skeleton className="size-1 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </nav>

        <header className="border-b pt-9 pb-6 sm:flex sm:items-end sm:justify-between sm:gap-8">
          <div>
            <Skeleton className="mb-3 h-3 w-24" />
            <Skeleton className="h-9 w-56 sm:h-10 sm:w-72" />
          </div>
          <Skeleton className="mt-4 h-12 w-full sm:mt-0 sm:w-80" />
        </header>

        <div className="grid gap-8 pt-8 lg:grid-cols-[13.75rem_minmax(0,1fr)] lg:gap-10 xl:gap-12">
          <aside
            aria-hidden="true"
            className="sticky top-24 hidden max-h-[calc(100dvh-7rem)] self-start overflow-hidden rounded-xl border bg-card/70 p-4 lg:block"
          >
            <Skeleton className="h-5 w-20" />
            <div className="mt-6 space-y-5">
              {filterSkeletons.map((index) => (
                <div className="space-y-3 border-t pt-5" key={index}>
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          </aside>

          <section aria-label="Produktliste wird geladen" className="min-w-0">
            <div aria-hidden="true" className="mb-6 flex items-center gap-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="ml-auto h-10 w-24 lg:hidden" />
              <Skeleton className="h-10 w-40" />
            </div>

            <div
              aria-hidden="true"
              className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-3 md:gap-x-4 xl:grid-cols-4"
            >
              {productSkeletons.map((index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>

            <div
              aria-hidden="true"
              className="mt-10 flex flex-col items-center gap-4 border-t pt-6 sm:flex-row sm:justify-between"
            >
              <Skeleton className="h-3 w-36" />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <Skeleton className="size-10 rounded-full" key={index} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </Container>
      <span className="sr-only" role="status">
        Katalog wird geladen...
      </span>
    </main>
  );
}
