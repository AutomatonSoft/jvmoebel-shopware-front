import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-24 sm:px-8">
      <section className="max-w-xl text-center">
        <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          Product not found
        </p>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          This product is no longer available.
        </h1>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          Browse the current furniture collection to find a similar piece.
        </p>
        <Link
          className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-destructive"
          href="/shop"
        >
          Return to shop
        </Link>
      </section>
    </main>
  );
}
