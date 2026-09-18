import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

const contentSkeletons = Array.from({ length: 3 }, (_, index) => index);
const cardSkeletons = Array.from({ length: 3 }, (_, index) => index);

export function CmsLandingPageLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Inhaltsseite wird geladen"
      className="flex-1"
    >
      <Container
        aria-hidden="true"
        as="nav"
        className="flex items-center gap-2 py-4"
      >
        <Skeleton className="h-4 w-20" />
        <Skeleton className="size-1 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </Container>

      <section aria-hidden="true" className="border-y bg-muted/40">
        <Container className="grid gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)] lg:items-center lg:gap-12">
          <div className="max-w-2xl">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-5 h-10 w-full sm:h-12" />
            <Skeleton className="mt-3 h-10 w-4/5 sm:h-12" />
            <Skeleton className="mt-7 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
            <Skeleton className="mt-8 h-11 w-36 rounded-xl" />
          </div>
          <Skeleton className="aspect-[4/3] rounded-2xl" />
        </Container>
      </section>

      <Container
        aria-hidden="true"
        className="space-y-14 py-12 sm:space-y-20 sm:py-16"
      >
        {contentSkeletons.map((index) => (
          <section className="max-w-3xl" key={index}>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-4 h-8 w-3/4 sm:h-9" />
            <Skeleton className="mt-6 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-11/12" />
            <Skeleton className="mt-2 h-4 w-4/5" />
          </section>
        ))}

        <section className="grid gap-4 sm:grid-cols-3">
          {cardSkeletons.map((index) => (
            <Skeleton className="aspect-[4/5] rounded-2xl" key={index} />
          ))}
        </section>
      </Container>
      <span className="sr-only" role="status">
        Inhaltsseite wird geladen...
      </span>
    </main>
  );
}
