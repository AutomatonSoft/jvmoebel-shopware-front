import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Kasse wird geladen"
      className="flex-1 bg-background"
    >
      <Container className="py-4 sm:py-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-3 h-9 w-36" />
        <Skeleton className="mt-3 h-4 w-64 max-w-full" />
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] xl:gap-12">
          <div className="rounded-3xl border bg-card p-5 sm:p-7">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="mt-4 h-20 w-full" />
            <Skeleton className="mt-4 h-20 w-full" />
          </div>
          <div className="rounded-3xl border bg-card p-5 sm:p-7">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-6 h-28 w-full" />
          </div>
        </div>
      </Container>
    </main>
  );
}
