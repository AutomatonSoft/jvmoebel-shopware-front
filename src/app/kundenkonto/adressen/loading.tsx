import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddressesLoading() {
  return (
    <main aria-busy="true" aria-label="Adresse wird geladen" className="flex-1">
      <Container className="max-w-3xl py-7 sm:py-9">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-6 h-8 w-48" />
        <Skeleton className="mt-3 h-4 w-full max-w-lg" />
        <div
          aria-hidden="true"
          className="mt-5 rounded-2xl border bg-card p-4 sm:p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index}>
                <Skeleton className="mb-2 h-3 w-28" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-6 h-10 w-40 rounded-lg" />
        </div>
      </Container>
      <span className="sr-only" role="status">
        Adresse wird geladen...
      </span>
    </main>
  );
}
