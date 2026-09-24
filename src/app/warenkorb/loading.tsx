import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Warenkorb wird geladen"
      className="flex-1 bg-[#faf7f2]"
    >
      <Container className="py-6 sm:py-8">
        <Skeleton className="h-3 w-32" />
        <div className="mt-8">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-9 w-56 sm:w-72" />
          <Skeleton className="mt-3 h-4 w-44" />
        </div>
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] xl:gap-12">
          <div className="rounded-3xl border bg-card p-5 sm:p-7">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="mt-6 h-28 w-full" />
          </div>
          <div className="rounded-3xl border bg-card p-5 sm:p-7">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mt-6 h-24 w-full" />
          </div>
        </div>
      </Container>
    </main>
  );
}
