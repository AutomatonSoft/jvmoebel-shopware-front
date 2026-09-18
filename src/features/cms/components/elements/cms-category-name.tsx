export function CmsCategoryName({ name }: Readonly<{ name: string }>) {
  return (
    <h1
      className="text-3xl leading-none font-semibold tracking-[-0.04em] text-balance sm:text-4xl"
      data-cms-element="category-name"
    >
      {name}
    </h1>
  );
}
