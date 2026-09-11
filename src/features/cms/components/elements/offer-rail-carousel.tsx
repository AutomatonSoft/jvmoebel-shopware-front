"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { CmsLink } from "@/features/cms/components/cms-link";
import type { CmsOfferRailData } from "@/features/cms/contracts/offer-rail";
import {
  formatCountdownLabel,
  formatCountdownValue,
  getCountdownParts,
} from "@/features/offers/model/countdown";
import { cn } from "@/lib/utils";

type ScrollState = Readonly<{
  canScrollBack: boolean;
  canScrollForward: boolean;
}>;

const initialScrollState: ScrollState = {
  canScrollBack: false,
  canScrollForward: false,
};

function OfferCountdown({
  endsAt,
  now,
}: {
  endsAt: string;
  now: number | null;
}) {
  const parts = now === null ? null : getCountdownParts(endsAt, now);

  return (
    <div
      className={cn(
        "flex min-h-6 items-center gap-2 text-xs sm:text-sm",
        now === null && "invisible",
      )}
    >
      <span aria-hidden="true">Nur noch:</span>
      <time
        aria-label={
          parts ? formatCountdownLabel(parts) : "Restzeit wird geladen"
        }
        className="font-semibold tracking-[0.12em] tabular-nums"
        dateTime={endsAt}
        role="timer"
      >
        {parts ? formatCountdownValue(parts) : "00:00:00:00"}
      </time>
    </div>
  );
}

function OfferCard({
  now,
  offer,
}: {
  now: number | null;
  offer: CmsOfferRailData["offers"][number];
}) {
  return (
    <article className="group relative isolate aspect-[3/4] overflow-hidden rounded-2xl bg-foreground text-white shadow-[0_18px_45px_-30px_rgba(21,21,19,0.72)]">
      <Image
        alt={offer.image.alt}
        className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.035]"
        fill
        sizes="(max-width: 640px) 82vw, (max-width: 1024px) 45vw, 33vw"
        src={offer.image.url}
        unoptimized={offer.image.url.startsWith("http")}
      />
      <span className="absolute inset-0 bg-linear-to-t from-black/85 via-black/15 to-transparent" />

      <CmsLink
        aria-label={offer.title}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:ring-3 focus-visible:ring-primary focus-visible:ring-inset focus-visible:outline-none"
        href={offer.url}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6">
        {offer.endsAt && <OfferCountdown endsAt={offer.endsAt} now={now} />}
        <h3 className="mt-2 text-2xl leading-tight font-semibold tracking-[-0.035em] text-balance sm:text-3xl">
          {offer.title}
        </h3>
        {offer.subtitle && (
          <p className="mt-2 text-sm leading-6 text-white/85 sm:text-base">
            {offer.subtitle}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline decoration-white/55 underline-offset-4 transition-colors group-hover:decoration-white">
          {offer.ctaLabel}
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
          />
        </span>
        {offer.legalText && (
          <p className="mt-3 text-[0.6875rem] leading-4 text-white/70">
            {offer.legalText}
          </p>
        )}
      </div>
    </article>
  );
}

export function OfferRailCarousel({ data }: { data: CmsOfferRailData }) {
  const railRef = useRef<HTMLUListElement>(null);
  const [now, setNow] = useState<number | null>(null);
  const [scrollState, setScrollState] =
    useState<ScrollState>(initialScrollState);
  const deadlines = data.offers.flatMap((offer) =>
    offer.endsAt ? [Date.parse(offer.endsAt)] : [],
  );
  const latestDeadline = deadlines.length > 0 ? Math.max(...deadlines) : null;
  const activeOffers = data.offers.filter(
    (offer) => !offer.endsAt || now === null || Date.parse(offer.endsAt) > now,
  );

  useEffect(() => {
    if (latestDeadline === null) {
      return;
    }

    const deadline = latestDeadline;

    function updateNow() {
      const currentNow = Date.now();
      setNow(currentNow);

      if (currentNow >= deadline) {
        window.clearInterval(timer);
      }
    }

    const timer = window.setInterval(updateNow, 1000);
    const initialTick = window.setTimeout(updateNow, 0);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(initialTick);
    };
  }, [latestDeadline]);

  useEffect(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    function updateScrollState() {
      if (!rail) {
        return;
      }

      const maximumScrollLeft = rail.scrollWidth - rail.clientWidth;

      setScrollState({
        canScrollBack: rail.scrollLeft > 2,
        canScrollForward: rail.scrollLeft < maximumScrollLeft - 2,
      });
    }

    updateScrollState();
    rail.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      rail.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [activeOffers.length]);

  function scrollRail(direction: -1 | 1) {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    rail.scrollBy({
      behavior: "smooth",
      left: direction * Math.max(rail.clientWidth * 0.82, 280),
    });
  }

  if (activeOffers.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={data.ariaLabel}
      className="mx-auto w-full max-w-360 px-4 pt-16 sm:px-8 sm:pt-20"
      data-cms-element="jv-offer-rail"
    >
      <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
        <div>
          {data.eyebrow && (
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase before:block before:size-2 before:bg-primary">
              {data.eyebrow}
            </p>
          )}
          <h2 className="text-3xl leading-none font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
            {data.title}
          </h2>
          {data.description && (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              {data.description}
            </p>
          )}
        </div>

        {activeOffers.length > 1 && (
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              aria-label="Vorherige Aktionen anzeigen"
              className="flex size-11 items-center justify-center rounded-full border bg-card transition-[background-color,border-color,color] hover:border-foreground/35 hover:bg-secondary disabled:cursor-default disabled:opacity-35"
              disabled={!scrollState.canScrollBack}
              onClick={() => scrollRail(-1)}
              type="button"
            >
              <ArrowLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              aria-label="Weitere Aktionen anzeigen"
              className="flex size-11 items-center justify-center rounded-full border bg-card transition-[background-color,border-color,color] hover:border-foreground/35 hover:bg-secondary disabled:cursor-default disabled:opacity-35"
              disabled={!scrollState.canScrollForward}
              onClick={() => scrollRail(1)}
              type="button"
            >
              <ArrowRight aria-hidden="true" className="size-5" />
            </button>
          </div>
        )}
      </div>

      <ul
        aria-label={data.title}
        className="-mx-4 grid snap-x snap-mandatory scroll-px-4 auto-cols-[82vw] grid-flow-col gap-3 overflow-x-auto overscroll-x-contain px-4 pb-5 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:auto-cols-[minmax(18rem,45vw)] sm:gap-4 sm:px-8 lg:mx-0 lg:scroll-px-0 lg:auto-cols-[calc((100%-2rem)/3)] lg:px-0 [&::-webkit-scrollbar]:hidden"
        ref={railRef}
      >
        {activeOffers.map((offer) => (
          <li className="snap-start" key={offer.id}>
            <OfferCard now={now} offer={offer} />
          </li>
        ))}
      </ul>
    </section>
  );
}
