import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerAccountLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Kundenkonto wird geladen"
      className="flex-1 bg-background"
    >
      <Container className="py-6 sm:py-8">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-9 h-3 w-24" />
        <Skeleton className="mt-4 h-9 w-full max-w-xl" />
        <Skeleton className="mt-3 h-4 w-40" />
        <nav
          aria-hidden="true"
          className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {Array.from({ length: 4 }, (_, index) => (
            <div className="h-40 rounded-3xl border bg-card p-5" key={index}>
              <Skeleton className="size-11 rounded-full" />
              <Skeleton className="mt-6 h-4 w-28" />
              <Skeleton className="mt-3 h-3 w-full" />
            </div>
          ))}
        </nav>
        <div
          aria-hidden="true"
          className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(17rem,0.7fr)]"
        >
          <div className="space-y-12">
            {[0, 1, 2].map((index) => (
              <section key={index}>
                <Skeleton className="h-6 w-44" />
                <div className="mt-4 rounded-3xl border bg-card p-6">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="mt-3 h-4 w-3/4" />
                </div>
              </section>
            ))}
          </div>
          <aside className="space-y-6">
            {[0, 1].map((index) => (
              <div className="rounded-3xl border bg-card p-5" key={index}>
                <Skeleton className="size-9 rounded-full" />
                <Skeleton className="mt-4 h-4 w-40" />
                <Skeleton className="mt-3 h-3 w-full" />
              </div>
            ))}
          </aside>
        </div>
      </Container>
      <span className="sr-only" role="status">
        Kundenkonto wird geladen...
      </span>
    </main>
  );
}
