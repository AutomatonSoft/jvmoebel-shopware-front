import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <section aria-busy="true" aria-label="Anmeldung wird geladen">
      <div aria-hidden="true" className="space-y-2">
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
        {[0, 1].map((index) => (
          <div key={index}>
            <Skeleton className="mb-2 h-3 w-28" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        ))}
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
      <span className="sr-only" role="status">
        Anmeldung wird geladen...
      </span>
    </section>
  );
}
