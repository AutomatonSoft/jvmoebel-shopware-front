import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderConfirmationLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Bestellbestätigung wird geladen"
      className="flex-1 bg-background"
    >
      <Container className="py-10 sm:py-16">
        <section
          aria-hidden="true"
          className="mx-auto max-w-3xl overflow-hidden rounded-3xl border bg-card"
        >
          <div className="bg-secondary/75 px-6 py-10 text-center sm:px-10 sm:py-14">
            <Skeleton className="mx-auto size-16 rounded-full" />
            <Skeleton className="mx-auto mt-6 h-3 w-40" />
            <Skeleton className="mx-auto mt-4 h-9 w-full max-w-lg" />
            <Skeleton className="mx-auto mt-5 h-4 w-full max-w-xl" />
            <Skeleton className="mx-auto mt-2 h-4 w-4/5 max-w-lg" />
          </div>
          <div className="grid gap-6 px-6 py-8 sm:grid-cols-2 sm:px-10">
            {Array.from({ length: 2 }, (_, index) => (
              <div className="rounded-2xl border p-5" key={index}>
                <Skeleton className="h-3 w-32" />
                <Skeleton className="mt-4 h-6 w-40" />
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center gap-3 border-t px-6 py-7 sm:flex-row sm:px-10">
            <Skeleton className="h-10 w-full rounded-xl sm:w-36" />
            <Skeleton className="h-10 w-full rounded-xl sm:w-40" />
          </div>
        </section>
      </Container>
      <span className="sr-only" role="status">
        Bestellbestätigung wird geladen...
      </span>
    </main>
  );
}
