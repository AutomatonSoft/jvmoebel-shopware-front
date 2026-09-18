import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function WishlistLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Wunschliste wird geladen"
      className="flex-1"
    >
      <Container className="py-8 sm:py-12">
        <Skeleton className="h-3 w-28" />
        <header className="mt-8 border-b border-border/80 pb-8">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-4 h-9 w-72 sm:h-12" />
          <Skeleton className="mt-4 h-5 max-w-xl" />
        </header>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton className="aspect-[4/5] rounded-3xl" key={index} />
          ))}
        </div>
      </Container>
    </main>
  );
}
