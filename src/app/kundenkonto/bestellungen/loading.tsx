import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Bestellungen werden geladen"
      className="flex-1"
    >
      <Container className="max-w-4xl py-10 sm:py-14">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-6 h-10 w-72 max-w-full" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl" />
        <section
          aria-hidden="true"
          className="mt-8 overflow-hidden rounded-3xl border bg-card"
        >
          {Array.from({ length: 3 }, (_, index) => (
            <div
              className="flex flex-wrap items-center gap-4 border-b p-5 last:border-b-0"
              key={index}
            >
              <Skeleton className="size-8 rounded-full" />
              <div className="min-w-40 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-2 h-3 w-24" />
              </div>
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </section>
      </Container>
      <span className="sr-only" role="status">
        Bestellungen werden geladen...
      </span>
    </main>
  );
}
