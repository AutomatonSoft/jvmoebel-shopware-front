import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Bestellung wird geladen"
      className="flex-1"
    >
      <Container className="max-w-5xl py-6 sm:py-9">
        <Skeleton className="h-4 w-36" />
        <header aria-hidden="true" className="mt-5 border-b pb-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-8 w-48" />
        </header>
        <div
          aria-hidden="true"
          className="mt-5 grid divide-y rounded-2xl border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        >
          {Array.from({ length: 3 }, (_, index) => (
            <div className="px-5 py-3.5" key={index}>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-2 h-4 w-32" />
            </div>
          ))}
        </div>
        <div
          aria-hidden="true"
          className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]"
        >
          <section className="overflow-hidden rounded-2xl border bg-card">
            <div className="border-b px-5 py-3.5">
              <Skeleton className="h-4 w-20" />
            </div>
            {[0, 1].map((index) => (
              <div
                className="flex justify-between gap-5 border-b px-5 py-4"
                key={index}
              >
                <div className="flex-1">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="mt-2 h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
            <div className="bg-secondary px-5 py-4">
              <Skeleton className="h-4 w-full max-w-48" />
            </div>
          </section>
          <aside className="rounded-2xl border bg-card p-5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-6 h-3 w-20" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-6 h-3 w-20" />
            <Skeleton className="mt-3 h-4 w-3/4" />
          </aside>
        </div>
      </Container>
      <span className="sr-only" role="status">
        Bestellung wird geladen...
      </span>
    </main>
  );
}
