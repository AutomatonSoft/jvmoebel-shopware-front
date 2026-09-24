import { Skeleton } from "@/components/ui/skeleton";

export default function RegistrationLoading() {
  return (
    <section aria-busy="true" aria-label="Registrierung wird geladen">
      <div aria-hidden="true" className="space-y-3">
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index}>
              <Skeleton className="mb-2 h-3 w-28" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <Skeleton className="h-5 w-full max-w-xs" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
      <span className="sr-only" role="status">
        Registrierung wird geladen...
      </span>
    </section>
  );
}
