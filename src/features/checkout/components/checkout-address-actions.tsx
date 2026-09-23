import { Ellipsis, Pencil, Plus } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

export function CheckoutAddressActions({
  addHref,
  editHref,
  label,
}: Readonly<{
  addHref?: Route;
  editHref?: Route;
  label: string;
}>) {
  if (!addHref && !editHref) return null;

  if (!addHref || !editHref) {
    return (
      <Link
        aria-label={`${label} ${editHref ? "ändern" : "hinzufügen"}`}
        className="grid size-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
        href={(editHref ?? addHref)!}
      >
        {editHref ? (
          <Pencil aria-hidden="true" className="size-4" />
        ) : (
          <Plus aria-hidden="true" className="size-4" />
        )}
      </Link>
    );
  }

  return (
    <div className="group relative">
      <button
        aria-label={`${label}: Aktionen öffnen`}
        className="grid size-9 cursor-pointer place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
        type="button"
      >
        <Ellipsis aria-hidden="true" className="size-5" />
      </button>
      <div className="pointer-events-none invisible absolute top-full right-0 z-10 flex origin-top-right translate-y-1 gap-1 rounded-xl border bg-card p-1 opacity-0 shadow-lg transition-[opacity,transform] duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <Link
          aria-label={`${label} ändern`}
          className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
          href={editHref}
          title="Bearbeiten"
        >
          <Pencil aria-hidden="true" className="size-4" />
        </Link>
        <Link
          aria-label={`${label} hinzufügen`}
          className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
          href={addHref}
          title="Neue Adresse"
        >
          <Plus aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </div>
  );
}
