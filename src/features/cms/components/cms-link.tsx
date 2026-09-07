import type { Route } from "next";
import Link from "next/link";
import type { ComponentProps } from "react";

export type CmsLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
};

export function CmsLink({ href, ...props }: CmsLinkProps) {
  if (href.startsWith("/") && !href.startsWith("//")) {
    return <Link href={href as Route} {...props} />;
  }

  return <a href={href} {...props} />;
}
