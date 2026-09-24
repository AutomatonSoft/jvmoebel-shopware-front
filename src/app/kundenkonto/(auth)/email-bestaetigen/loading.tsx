import { Skeleton } from "@/components/ui/skeleton";

export default function EmailConfirmationPendingLoading() {
  return (
    <section
      aria-busy="true"
      aria-label="E-Mail-Bestätigung wird geladen"
      className="flex min-h-72 flex-col items-center justify-center py-5"
    >
      <div aria-hidden="true" className="flex w-full flex-col items-center">
        <Skeleton className="size-10 rounded-xl" />
        <Skeleton className="mt-4 h-3 w-32" />
        <Skeleton className="mt-3 h-7 w-full max-w-sm" />
        <Skeleton className="mt-3 h-4 w-full max-w-sm" />
        <div className="mt-5 flex gap-2.5">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton className="size-11 rounded-xl" key={index} />
          ))}
        </div>
        <Skeleton className="mt-4 h-10 w-full max-w-sm rounded-lg" />
        <Skeleton className="mt-6 h-10 w-full max-w-sm rounded-lg" />
      </div>
      <span className="sr-only" role="status">
        E-Mail-Bestätigung wird geladen...
      </span>
    </section>
  );
}
