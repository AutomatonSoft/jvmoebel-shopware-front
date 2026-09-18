import {
  ArrowRight,
  Bell,
  CircleHelp,
  Gift,
  LogOut,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { AccountWishlistSummary } from "@/features/customer-account/components/account-wishlist-summary";
import type {
  CustomerAccountSummary,
  CustomerOrderSummary,
} from "@/features/customer-account/model/account";
import { logoutCustomer } from "@/features/customer-account/server/actions";

type CustomerProfilePageProps = Readonly<{
  account: CustomerAccountSummary;
  orders: readonly CustomerOrderSummary[] | null;
}>;

const accountLinks = [
  {
    description: "Bestellstatus und vergangene Einkäufe ansehen.",
    href: "/kundenkonto/bestellungen",
    icon: PackageCheck,
    label: "Bestellungen",
  },
  {
    description: "Persönliche Angaben und E-Mail-Adresse prüfen.",
    href: "/kundenkonto/profil",
    icon: UserRound,
    label: "Kundenprofil",
  },
  {
    description: "Rechnungs- und Lieferadresse ansehen.",
    href: "/kundenkonto/adressen",
    icon: MapPin,
    label: "Adressen",
  },
  {
    description: "Informationen zu Aktionen und dem Kundenkonto.",
    href: "/kundenkonto/benachrichtigungen",
    icon: Bell,
    label: "Benachrichtigungen",
  },
] as const;

function AccountSection({
  children,
  id,
  title,
}: Readonly<{ children: ReactNode; id: string; title: string }>) {
  return (
    <section aria-labelledby={`${id}-title`} className="scroll-mt-28" id={id}>
      <h2
        className="text-xl font-semibold tracking-[-0.03em]"
        id={`${id}-title`}
      >
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function CustomerOrders({ orders }: Pick<CustomerProfilePageProps, "orders">) {
  if (orders === null) {
    return (
      <p className="rounded-2xl border border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
        Ihre Bestellungen können gerade nicht geladen werden. Bitte versuchen
        Sie es später erneut.
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
        <div>
          <p className="font-semibold">Noch keine aktuellen Bestellungen</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Entdecken Sie Möbel, die zu Ihrem Zuhause passen.
          </p>
        </div>
        <Button
          className="mt-5 sm:mt-0"
          nativeButton={false}
          render={<Link href="/moebel-sortiment" />}
          variant="outline"
        >
          Sortiment entdecken <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {orders.map((order) => {
        const date = new Intl.DateTimeFormat("de-DE", {
          dateStyle: "medium",
        }).format(new Date(order.date));
        const total = new Intl.NumberFormat("de-DE", {
          currency: order.currency,
          style: "currency",
        }).format(order.total);
        return (
          <article
            className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-border px-5 py-4 last:border-b-0"
            key={order.number}
          >
            <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
              <ShoppingBag aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-40 flex-1">
              <p className="text-sm font-semibold">Bestellung {order.number}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{date}</p>
            </div>
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold">
              {order.status}
            </span>
            <p className="ml-auto text-sm font-semibold">{total}</p>
          </article>
        );
      })}
    </div>
  );
}

export function CustomerProfilePage({
  account,
  orders,
}: CustomerProfilePageProps) {
  const fullName = `${account.firstName} ${account.lastName}`.trim();

  return (
    <main className="flex-1 bg-background">
      <Container className="py-8 sm:py-10 lg:py-14">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Link className="transition-colors hover:text-primary" href="/">
            Startseite
          </Link>
          <span aria-hidden="true">/</span>
          <strong className="font-medium text-foreground">Kundenkonto</strong>
        </nav>
        <header className="mt-8 border-b border-border pb-8 sm:mt-10 sm:pb-10">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            Mein JVMöbel
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Hallo {account.firstName}, willkommen zurück!
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Kundennummer {account.customerNumber}
          </p>
        </header>

        <nav
          aria-label="Bereiche im Kundenkonto"
          className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {accountLinks.map(({ description, href, icon: Icon, label }) => (
            <Link
              className="group rounded-2xl border border-border bg-card p-5 transition-[border-color,box-shadow,transform] hover:border-primary/45 hover:shadow-[0_16px_36px_-28px_rgba(21,21,19,0.7)] motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
              href={href}
              key={href}
            >
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <p className="mt-6 text-sm font-semibold">{label}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {description}
              </p>
            </Link>
          ))}
        </nav>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(17rem,0.7fr)] lg:gap-16">
          <div className="space-y-12">
            <AccountSection id="orders" title="Ihre Bestellungen">
              <CustomerOrders orders={orders} />
              <Link
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
                href="/kundenkonto/bestellungen"
              >
                Alle Bestellungen ansehen{" "}
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </Link>
            </AccountSection>
            <AccountSection id="profile" title="Kundenprofil">
              <div className="grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="mt-1 text-sm font-semibold">{fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    E-Mail-Adresse
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold">
                    {account.email}
                  </p>
                </div>
              </div>
            </AccountSection>
            <AccountSection id="addresses" title="Ihre Adresse">
              {account.billingAddress ? (
                <div className="rounded-2xl border border-border bg-card p-5 text-sm leading-6">
                  <p className="font-semibold">
                    {account.billingAddress.firstName}{" "}
                    {account.billingAddress.lastName}
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    {account.billingAddress.street}
                    <br />
                    {account.billingAddress.zipcode}{" "}
                    {account.billingAddress.city}
                    {account.billingAddress.country && (
                      <>
                        <br />
                        {account.billingAddress.country}
                      </>
                    )}
                  </p>
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
                  Für dieses Kundenkonto ist noch keine Adresse hinterlegt.
                </p>
              )}
            </AccountSection>
          </div>

          <aside className="space-y-8 lg:pt-1">
            <AccountSection id="notifications" title="Benachrichtigungen">
              <div className="rounded-2xl bg-secondary p-5">
                <Gift aria-hidden="true" className="size-5 text-primary" />
                <p className="mt-5 text-sm font-semibold">
                  Neuigkeiten von JVMöbel
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Wichtige Informationen zu Ihrem Konto und Ihren Bestellungen
                  erhalten Sie per E-Mail.
                </p>
              </div>
            </AccountSection>
            <AccountSection id="advantages" title="Vorteile & Angebote">
              <div className="rounded-2xl bg-secondary p-5">
                <Gift aria-hidden="true" className="size-5 text-primary" />
                <p className="mt-5 text-sm font-semibold">Exklusive Aktionen</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Entdecken Sie laufende Rabatte und neue Lieblingsstücke.
                </p>
                <Link
                  className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
                  href="/rabatt-angebote"
                >
                  Angebote ansehen{" "}
                  <ArrowRight aria-hidden="true" className="size-3.5" />
                </Link>
              </div>
            </AccountSection>
            <AccountWishlistSummary />
            <AccountSection id="help" title="Hilfe & Kontakt">
              <div className="rounded-2xl border border-border bg-card p-5">
                <CircleHelp
                  aria-hidden="true"
                  className="size-5 text-primary"
                />
                <p className="mt-5 text-sm font-semibold">
                  Wir helfen gern weiter
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Antworten auf häufige Fragen und persönliche Beratung finden
                  Sie im Servicebereich.
                </p>
              </div>
            </AccountSection>
            <form action={logoutCustomer}>
              <Button className="w-full" type="submit" variant="outline">
                <LogOut aria-hidden="true" />
                Abmelden
              </Button>
            </form>
          </aside>
        </div>

        <section className="mt-12 rounded-3xl bg-accent px-6 py-8 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase">
              <Sparkles aria-hidden="true" className="size-4" />
              Für Ihr Zuhause
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">
              Neue Ideen für Ihre Einrichtung
            </h2>
          </div>
          <Button
            className="mt-5 sm:mt-0"
            nativeButton={false}
            render={<Link href="/inspiration" />}
          >
            Inspiration entdecken <ArrowRight aria-hidden="true" />
          </Button>
        </section>
      </Container>
    </main>
  );
}
