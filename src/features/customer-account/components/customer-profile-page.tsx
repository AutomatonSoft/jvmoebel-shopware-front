import {
  BadgeCheck,
  ChevronDown,
  CircleCheck,
  Gift,
  LogOut,
  MapPin,
  ShoppingBag,
  Sofa,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import type { CustomerAccountSummary } from "@/features/customer-account/model/account";
import { logoutCustomer } from "@/features/customer-account/server/actions";

type CustomerProfilePageProps = Readonly<{
  account: CustomerAccountSummary;
}>;

const accountNavigation = [
  {
    href: "#personal-data",
    icon: UserRound,
    label: "Persönliche Daten",
  },
  {
    href: "#billing-address",
    icon: MapPin,
    label: "Standardadresse",
  },
  { href: "/warenkorb", icon: ShoppingBag, label: "Warenkorb" },
  { href: "/rabatt-angebote", icon: Gift, label: "Angebote" },
  { href: "/moebel-sortiment", icon: Sofa, label: "Sortiment" },
] as const;

type ProfileFieldProps = Readonly<{
  label: string;
  value: string;
  verified?: boolean;
}>;

function ProfileField({ label, value, verified = false }: ProfileFieldProps) {
  return (
    <div className="relative min-h-16 rounded-xl border border-border/90 bg-card px-4 pt-2.5 pb-3">
      <p className="text-[0.625rem] font-medium text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate pr-7 text-sm font-medium text-foreground">
        {value}
      </p>
      {verified && (
        <CircleCheck
          aria-label="Bestätigt"
          className="absolute top-1/2 right-4 size-4 -translate-y-1/2 text-primary"
        />
      )}
    </div>
  );
}

type ProfileSectionProps = Readonly<{
  children: ReactNode;
  eyebrow?: string;
  id: string;
  title: string;
}>;

function ProfileSection({ children, eyebrow, id, title }: ProfileSectionProps) {
  return (
    <section aria-labelledby={`${id}-title`} className="scroll-mt-28" id={id}>
      <details className="group" open>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 border-b border-border/80 pb-3 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
          <span>
            {eyebrow && (
              <span className="block text-[0.625rem] font-semibold tracking-[0.13em] text-muted-foreground uppercase">
                {eyebrow}
              </span>
            )}
            <h2
              className="mt-0.5 text-base font-semibold tracking-[-0.02em]"
              id={`${id}-title`}
            >
              {title}
            </h2>
          </span>
          <ChevronDown
            aria-hidden="true"
            className="size-4 text-foreground transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="mt-4">{children}</div>
      </details>
    </section>
  );
}

export function CustomerProfilePage({ account }: CustomerProfilePageProps) {
  const initials = `${account.firstName.charAt(0)}${account.lastName.charAt(0)}`;
  const fullName = `${account.firstName} ${account.lastName}`;

  return (
    <main className="flex-1 bg-[#f8f8f6]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[0.6875rem] text-muted-foreground"
        >
          <Link className="transition-colors hover:text-primary" href="/">
            Startseite
          </Link>
          <span aria-hidden="true">/</span>
          <strong className="font-medium text-foreground">Kundenkonto</strong>
        </nav>

        <div className="mt-7 grid items-start lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="border-b border-border/80 pb-7 lg:sticky lg:top-24 lg:border-r lg:border-b-0 lg:pr-7 lg:pb-10">
            <div className="flex items-center gap-3.5">
              <div className="grid size-14 shrink-0 place-items-center rounded-full bg-primary/12 text-base font-semibold text-primary">
                <span aria-label={`Initialen ${initials}`}>{initials}</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{fullName}</p>
                <p className="mt-1 truncate text-[0.6875rem] text-muted-foreground">
                  Kunde #{account.customerNumber}
                </p>
              </div>
            </div>

            <nav
              aria-label="Navigation im Kundenkonto"
              className="mt-7 grid gap-1 border-t border-border/80 pt-5 sm:grid-cols-2 lg:grid-cols-1"
            >
              {accountNavigation.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Link
                    aria-current={index === 0 ? "page" : undefined}
                    className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
                      index === 0
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-card hover:text-foreground"
                    }`}
                    href={item.href}
                    key={item.href}
                  >
                    <Icon
                      aria-hidden="true"
                      className={`size-4 ${index === 0 ? "text-primary" : ""}`}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <form
              action={logoutCustomer}
              className="mt-5 border-t border-border/80 pt-5"
            >
              <Button
                className="w-full justify-start px-3 text-xs"
                type="submit"
                variant="ghost"
              >
                <LogOut aria-hidden="true" />
                Abmelden
              </Button>
            </form>
          </aside>

          <div className="pt-8 lg:max-w-4xl lg:pt-0 lg:pl-12 xl:pl-16">
            <header>
              <p className="text-[0.625rem] font-semibold tracking-[0.15em] text-primary uppercase">
                Mein JVMöbel
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                Mein Kundenkonto
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Verwalten Sie hier Ihre Kontaktdaten und sehen Sie Ihre
                hinterlegte Standardadresse.
              </p>
            </header>

            <section className="mt-7 flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <BadgeCheck aria-hidden="true" className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Kundenkonto aktiv</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Ihre persönlichen Angaben sind sicher hinterlegt.
                  </p>
                </div>
              </div>
              <span className="w-fit rounded-full bg-muted px-3 py-1.5 text-[0.6875rem] font-semibold whitespace-nowrap">
                Kundennummer {account.customerNumber}
              </span>
            </section>

            <div className="mt-8 grid gap-9">
              <ProfileSection id="contact-data" title="Kontaktdaten">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ProfileField
                    label="E-Mail-Adresse"
                    value={account.email}
                    verified
                  />
                  <ProfileField
                    label="Kundennummer"
                    value={account.customerNumber}
                  />
                </div>
              </ProfileSection>

              <ProfileSection id="personal-data" title="Persönliche Daten">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ProfileField label="Vorname" value={account.firstName} />
                  <ProfileField label="Nachname" value={account.lastName} />
                </div>
              </ProfileSection>

              <ProfileSection
                eyebrow="Lieferung & Rechnung"
                id="billing-address"
                title="Standardadresse"
              >
                {account.billingAddress ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <ProfileField
                        label="Straße und Hausnummer"
                        value={account.billingAddress.street}
                      />
                    </div>
                    <ProfileField
                      label="Postleitzahl"
                      value={account.billingAddress.zipcode ?? "—"}
                    />
                    <ProfileField
                      label="Stadt"
                      value={account.billingAddress.city}
                    />
                    <div className="sm:col-span-2">
                      <ProfileField
                        label="Land"
                        value={account.billingAddress.country ?? "—"}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="rounded-xl border border-border/80 bg-card p-4 text-sm leading-6 text-muted-foreground">
                    Für dieses Kundenkonto ist noch keine Standardadresse
                    hinterlegt.
                  </p>
                )}
              </ProfileSection>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
