import { Skeleton } from "@/components/ui/skeleton";

export default function EmailConfirmationResultLoading() {
  return (
    <section
      aria-busy="true"
      aria-label="Bestätigung wird geladen"
      className="flex min-h-72 flex-col justify-center py-8"
    >
      <div aria-hidden="true">
        <Skeleton className="size-12 rounded-full" />
        <Skeleton className="mt-7 h-3 w-32" />
        <Skeleton className="mt-3 h-8 w-full max-w-sm" />
        <Skeleton className="mt-3 h-4 w-full max-w-xs" />
        <Skeleton className="mt-7 h-11 w-full rounded-lg" />
      </div>
      <span className="sr-only" role="status">
        Bestätigung wird geladen...
      </span>
    </section>
  );
}
