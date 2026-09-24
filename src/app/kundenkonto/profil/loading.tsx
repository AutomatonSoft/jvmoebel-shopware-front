import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Kundenprofil wird geladen"
      className="flex-1"
    >
      <Container className="max-w-3xl py-7 sm:py-9">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-6 h-8 w-52" />
        <Skeleton className="mt-3 h-4 w-full max-w-md" />
        <div
          aria-hidden="true"
          className="mt-5 max-w-2xl rounded-3xl border bg-card p-5 sm:p-6"
        >
          {[0, 1, 2].map((index) => (
            <div className="mb-4" key={index}>
              <Skeleton className="mb-2 h-3 w-28" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          ))}
          <Skeleton className="mt-6 h-10 w-48 rounded-lg" />
        </div>
      </Container>
      <span className="sr-only" role="status">
        Kundenprofil wird geladen...
      </span>
    </main>
  );
}
