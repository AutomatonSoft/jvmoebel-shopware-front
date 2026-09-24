import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Benachrichtigungen werden geladen"
      className="flex-1"
    >
      <Container className="max-w-4xl py-7 sm:py-10">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-6 h-3 w-24" />
        <Skeleton className="mt-3 h-10 w-full max-w-sm" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl" />
        <div aria-hidden="true" className="mt-8 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }, (_, index) => (
            <section
              className="rounded-3xl border bg-card p-5 sm:p-6"
              key={index}
            >
              <Skeleton className="size-10 rounded-xl" />
              <Skeleton className="mt-4 h-5 w-44" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />
            </section>
          ))}
        </div>
        <Skeleton className="mt-6 h-20 w-full rounded-2xl" />
      </Container>
      <span className="sr-only" role="status">
        Benachrichtigungen werden geladen...
      </span>
    </main>
  );
}
