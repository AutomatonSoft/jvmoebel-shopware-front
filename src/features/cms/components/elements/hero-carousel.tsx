"use client";

import Image from "next/image";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type FocusEvent,
} from "react";

import { CmsButton } from "@/features/cms/components/cms-button";
import type {
  CmsHeroData,
  CmsHeroLink,
  CmsHeroSlide,
} from "@/features/cms/contracts/hero";
import { cn } from "@/lib/utils";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const captionLinkSizeClasses = {
  large: "h-11 px-6 text-sm",
  medium: "h-10 px-5 text-sm",
  small: "h-9 px-4 text-xs",
} as const;

function subscribeToReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);

  mediaQuery.addEventListener("change", onChange);

  return () => mediaQuery.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function CaptionPrimaryLink({ link }: { link: CmsHeroLink }) {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-white/75 bg-black/10 font-medium text-white backdrop-blur-sm transition-[background-color,border-color,color,transform] duration-300 hover:border-white hover:bg-white hover:text-foreground focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none motion-safe:active:scale-[0.98]",
        captionLinkSizeClasses[link.size],
      )}
      href={link.url}
    >
      {link.label}
    </a>
  );
}

function HeroSlide({
  active,
  index,
  slide,
  total,
}: {
  active: boolean;
  index: number;
  slide: CmsHeroSlide;
  total: number;
}) {
  const Heading = index === 0 ? "h1" : "h2";

  return (
    <li
      aria-hidden={!active}
      aria-label={`${index + 1} von ${total}`}
      aria-roledescription="Folie"
      className={cn(
        "absolute inset-0 transition-opacity duration-700 ease-out",
        active ? "z-10 opacity-100" : "pointer-events-none opacity-0",
      )}
      inert={!active}
      role="group"
    >
      <Image
        alt={slide.image.alt}
        className="object-cover"
        fill
        loading="eager"
        sizes="100vw"
        src={slide.image.url}
      />
      <div
        className={cn(
          "absolute inset-0",
          slide.layout === "caption"
            ? "bg-linear-to-t from-foreground/55 via-foreground/10 to-transparent"
            : "bg-linear-to-r from-black/80 via-black/40 to-black/10",
        )}
      />

      {slide.layout === "featured" && slide.promotion && (
        <div className="absolute top-5 right-5 rounded-2xl border border-white/25 bg-background/90 px-4 py-3 text-right text-foreground shadow-xl backdrop-blur-sm sm:top-8 sm:right-8 sm:px-5 sm:py-4 lg:top-12 lg:right-12">
          {slide.promotion.label && (
            <span className="block text-[0.625rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              {slide.promotion.label}
            </span>
          )}
          <strong className="mt-1 block text-xl leading-none font-semibold tracking-[-0.04em] sm:text-3xl">
            {slide.promotion.value}
          </strong>
        </div>
      )}

      <div
        className={cn(
          "relative mx-auto flex min-h-136 max-w-360 items-end px-6 pt-32 pb-28 sm:min-h-168 sm:px-12 lg:px-20",
          slide.layout === "featured" && "sm:items-center sm:py-28",
          slide.layout === "caption" && "lg:pb-12",
        )}
      >
        <div
          className={cn(
            "transition-[opacity,transform] duration-700 ease-out",
            slide.layout === "caption"
              ? "max-w-4xl lg:max-w-[calc(100%-22rem)]"
              : "max-w-2xl",
            active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          {slide.eyebrow && (
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] uppercase before:block before:size-2 before:bg-primary">
              {slide.eyebrow}
            </p>
          )}
          {slide.layout === "caption" ? (
            <Heading className="text-3xl leading-tight font-normal tracking-[-0.035em] text-balance sm:text-4xl lg:text-5xl">
              {slide.title}
              {slide.promotion && (
                <strong className="font-semibold">
                  {` ${slide.promotion.value}`}
                </strong>
              )}
            </Heading>
          ) : (
            <Heading className="text-4xl leading-[0.98] font-semibold tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
              {slide.title}
            </Heading>
          )}
          {slide.layout === "caption" && slide.promotion?.label && (
            <p className="mt-2 text-xs font-medium tracking-[0.08em] text-white/70 uppercase">
              {slide.promotion.label}
            </p>
          )}
          {slide.description && (
            <p
              className={cn(
                "max-w-xl text-sm leading-7 text-white/85 sm:text-base",
                slide.layout === "caption" ? "mt-4" : "mt-6",
              )}
            >
              {slide.description}
            </p>
          )}
          {slide.primaryLink || slide.secondaryLink ? (
            <div
              className={cn(
                "flex flex-wrap items-center gap-5",
                slide.layout === "caption" ? "mt-5" : "mt-8",
              )}
            >
              {slide.primaryLink &&
                (slide.layout === "caption" ? (
                  <CaptionPrimaryLink link={slide.primaryLink} />
                ) : (
                  <CmsButton
                    href={slide.primaryLink.url}
                    label={slide.primaryLink.label}
                    size={slide.primaryLink.size}
                  />
                ))}
              {slide.secondaryLink && (
                <CmsButton
                  href={slide.secondaryLink.url}
                  label={slide.secondaryLink.label}
                  size={slide.secondaryLink.size}
                  variant="link"
                />
              )}
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function HeroCarousel({ data }: { data: CmsHeroData }) {
  const { ariaLabel, autoplay, autoplayIntervalMs, slides } = data;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
  const hasMultipleSlides = slides.length > 1;
  const isAutoplayRunning =
    hasMultipleSlides && autoplay && !isInteracting && !prefersReducedMotion;

  useEffect(() => {
    if (!isAutoplayRunning) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, autoplayIntervalMs);

    return () => window.clearTimeout(timer);
  }, [activeIndex, autoplayIntervalMs, isAutoplayRunning, slides.length]);

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsInteracting(false);
    }
  }

  return (
    <section
      aria-label={ariaLabel || "Aktuelle Angebote und Kollektionen"}
      aria-roledescription="Karussell"
      className="relative isolate mx-2 mt-2 min-h-136 overflow-hidden rounded-3xl bg-muted text-background sm:mx-6 sm:min-h-168"
      data-cms-element="jv-hero"
      onBlurCapture={handleBlur}
      onFocusCapture={() => setIsInteracting(true)}
      onPointerEnter={() => setIsInteracting(true)}
      onPointerLeave={() => setIsInteracting(false)}
    >
      <ul>
        {slides.map((slide, index) => (
          <HeroSlide
            active={index === activeIndex}
            index={index}
            key={slide.id}
            slide={slide}
            total={slides.length}
          />
        ))}
      </ul>

      <p
        aria-atomic="true"
        aria-live={isAutoplayRunning ? "off" : "polite"}
        className="sr-only"
      >
        {slides[activeIndex]?.title}
      </p>

      {hasMultipleSlides && (
        <div
          aria-label="Folie auswählen"
          className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-3 backdrop-blur-sm sm:bottom-7"
          role="group"
        >
          {slides.map((slide, index) => (
            <button
              aria-current={index === activeIndex ? "true" : undefined}
              aria-label={`Folie ${index + 1} anzeigen`}
              className={cn(
                "h-2.5 rounded-full transition-[background-color,width] duration-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none",
                index === activeIndex
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/45 hover:bg-white/75",
              )}
              key={slide.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      )}
    </section>
  );
}
