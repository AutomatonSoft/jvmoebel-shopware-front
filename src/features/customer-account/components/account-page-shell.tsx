import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { AccountAuthTabs } from "@/features/customer-account/components/account-auth-tabs";
import { cn } from "@/lib/utils";

type AccountPageShellProps = Readonly<{
  authNavigation?: boolean;
  children: ReactNode;
  description?: string;
  eyebrow?: string;
  title?: string;
}>;

export function AccountPageShell({
  authNavigation = false,
  children,
  description,
  eyebrow = "Kundenkonto",
  title,
}: AccountPageShellProps) {
  return (
    <Container
      as="main"
      className={cn(
        "flex-1",
        authNavigation ? "py-2" : "py-6 sm:py-10 lg:py-12",
      )}
    >
      <div className="mx-auto max-w-6xl">
        {!authNavigation && (
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-[0.7rem] text-muted-foreground"
          >
            <Link className="transition-colors hover:text-foreground" href="/">
              Startseite
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">Kundenkonto</span>
          </nav>
        )}

        <div
          className={cn(
            "grid rounded-xl border border-border/70 bg-card",
            authNavigation
              ? "min-h-146 lg:grid-cols-2"
              : "lg:min-h-144 lg:grid-cols-2",
          )}
        >
          <div
            className={cn(
              "relative overflow-hidden bg-muted",
              authNavigation ? "hidden lg:block" : "h-44 sm:h-56 lg:h-auto",
            )}
          >
            <Image
              alt="Lichtdurchflutetes Wohnzimmer mit einem Sofa in warmem Terrakotta"
              className="object-cover object-[60%_center]"
              fill
              priority
              sizes="(min-width: 1216px) 576px, (min-width: 1024px) calc((100vw - 64px) / 2), (min-width: 640px) calc(100vw - 64px), calc(100vw - 32px)"
              src="/images/main/hero-editorial.webp"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-10">
              <p className="text-[0.6rem] font-medium tracking-[0.2em] uppercase">
                JVMoebel · Zuhause ankommen
              </p>
              <p className="mt-2 text-xl leading-snug font-medium tracking-tight lg:text-3xl">
                Schön, dass Sie da sind.
              </p>
            </div>
          </div>

          <div
            className={cn(
              "min-w-0 px-5 py-7 sm:px-10 sm:py-9 lg:px-12",
              authNavigation && "py-2 sm:px-6 sm:py-2 lg:px-10 lg:py-2",
              !authNavigation && "lg:py-10",
            )}
          >
            <div className="mx-auto w-full max-w-md">
              {authNavigation && <AccountAuthTabs />}

              {title && description && (
                <header>
                  <p className="text-[0.65rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                    {eyebrow}
                  </p>
                  <h1 className="mt-3 text-2xl leading-tight font-medium tracking-[-0.035em] sm:text-3xl">
                    {title}
                  </h1>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </header>
              )}

              <section className={cn(!authNavigation && "mt-7 min-h-100")}>
                {children}
              </section>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
