import { Container } from "@/components/ui/container";

export default function CustomerAccountLoading() {
  return (
    <main aria-busy="true" className="flex-1 bg-background">
      <Container className="py-6 sm:py-8">
        <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
        <div className="mt-8 h-8 w-64 max-w-full animate-pulse rounded bg-secondary" />
        <div className="mt-3 h-4 w-40 animate-pulse rounded bg-secondary" />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              className="h-40 animate-pulse rounded-3xl border bg-card"
              key={index}
            />
          ))}
        </div>
      </Container>
    </main>
  );
}
