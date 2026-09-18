"use client";

import Image from "next/image";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type FocusEvent,
} from "react";

import { CmsButton } from "@/features/cms/components/cms-button";
import { Container } from "@/components/ui/container";
import { CmsLink } from "@/features/cms/components/cms-link";
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
    <CmsLink
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-white/75 bg-black/10 font-medium text-white backdrop-blur-sm transition-[background-color,border-color,color,transform] duration-300 hover:border-white hover:bg-white hover:text-foreground focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none motion-safe:active:scale-[0.98]",
        captionLinkSizeClasses[link.size],
      )}
      href={link.url}
    >
      {link.label}
    </CmsLink>
  );
}

function HeroSlideOverlay({ layout }: { layout: CmsHeroSlide["layout"] }) {
  return (
    <div
      className={cn(
        "absolute inset-0",
        layout === "caption"
          ? "bg-linear-to-t from-foreground/55 via-foreground/10 to-transparent"
          : "bg-linear-to-r from-black/80 via-black/40 to-black/10",
      )}
    />
  );
}

function HeroSlidePromotion({ slide }: { slide: CmsHeroSlide }) {
  if (slide.layout !== "featured" || !slide.promotion) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute top-5 right-5 z-20 rounded-2xl border border-white/25 bg-background/90 px-4 py-3 text-right text-foreground shadow-xl backdrop-blur-sm sm:top-8 sm:right-8 sm:px-5 sm:py-4 lg:top-12 lg:right-12">
      {slide.promotion.label && (
        <span className="block text-[0.625rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {slide.promotion.label}
        </span>
      )}
      <strong className="mt-1 block text-xl leading-none font-semibold tracking-[-0.04em] sm:text-3xl">
        {slide.promotion.value}
      </strong>
    </div>
  );
}

function CaptionSlideContent({
  active,
  headingLevel: Heading,
  slide,
}: {
  active: boolean;
  headingLevel: CmsHeroData["headingLevel"];
  slide: CmsHeroSlide;
}) {
  return (
    <div className="pointer-events-none relative z-20 mx-auto flex min-h-136 max-w-360 items-end px-6 pt-32 pb-28 sm:min-h-168 sm:px-12 lg:px-20 lg:pb-12">
      <div
        className={cn(
          "max-w-4xl transition-[opacity,transform] duration-700 ease-out lg:max-w-[calc(100%-22rem)]",
          active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        {slide.eyebrow && (
          <p className="mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] uppercase before:block before:size-2 before:bg-primary">
            {slide.eyebrow}
          </p>
        )}
        <Heading className="text-3xl leading-tight font-normal tracking-[-0.035em] text-balance sm:text-4xl lg:text-5xl">
          {slide.title}
          {slide.promotion && (
            <strong className="font-semibold">{` ${slide.promotion.value}`}</strong>
          )}
        </Heading>
        {slide.promotion?.label && (
          <p className="mt-2 text-xs font-medium tracking-[0.08em] text-white/70 uppercase">
            {slide.promotion.label}
          </p>
        )}
        {slide.description && (
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
            {slide.description}
          </p>
        )}
        {(slide.primaryLink || slide.secondaryLink) && (
          <div className="pointer-events-auto mt-5 flex flex-wrap items-center gap-5">
            {slide.primaryLink && (
              <CaptionPrimaryLink link={slide.primaryLink} />
            )}
            {slide.secondaryLink && (
              <CmsButton
                href={slide.secondaryLink.url}
                label={slide.secondaryLink.label}
                size={slide.secondaryLink.size}
                variant="link"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FeaturedSlideContent({
  active,
  headingLevel: Heading,
  slide,
}: {
  active: boolean;
  headingLevel: CmsHeroData["headingLevel"];
  slide: CmsHeroSlide;
}) {
  return (
    <div className="pointer-events-none relative z-20 mx-auto flex min-h-136 max-w-360 items-end px-6 pt-32 pb-28 sm:min-h-168 sm:items-center sm:px-12 sm:py-28 lg:px-20">
      <div
        className={cn(
          "max-w-2xl transition-[opacity,transform] duration-700 ease-out",
          active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        {slide.eyebrow && (
          <p className="mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] uppercase before:block before:size-2 before:bg-primary">
            {slide.eyebrow}
          </p>
        )}
        <Heading className="text-4xl leading-[0.98] font-semibold tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
          {slide.title}
        </Heading>
        {slide.description && (
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
            {slide.description}
          </p>
        )}
        {(slide.primaryLink || slide.secondaryLink) && (
          <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-5">
            {slide.primaryLink && (
              <CmsButton
                href={slide.primaryLink.url}
                label={slide.primaryLink.label}
                size={slide.primaryLink.size}
              />
            )}
            {slide.secondaryLink && (
              <CmsButton
                href={slide.secondaryLink.url}
                label={slide.secondaryLink.label}
                size={slide.secondaryLink.size}
                variant="link"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function HeroSlideContent({
  active,
  headingLevel,
  slide,
}: {
  active: boolean;
  headingLevel: CmsHeroData["headingLevel"];
  slide: CmsHeroSlide;
}) {
  if (slide.layout === "caption") {
    return (
      <CaptionSlideContent
        active={active}
        headingLevel={headingLevel}
        slide={slide}
      />
    );
  }

  return (
    <FeaturedSlideContent
      active={active}
      headingLevel={headingLevel}
      slide={slide}
    />
  );
}

function HeroSlide({
  active,
  headingLevel,
  index,
  slide,
  total,
}: {
  active: boolean;
  headingLevel: CmsHeroData["headingLevel"];
  index: number;
  slide: CmsHeroSlide;
  total: number;
}) {
  const slideHeadingLevel = index === 0 ? headingLevel : "h2";

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
      <HeroSlideOverlay layout={slide.layout} />
      {slide.url && (
        <CmsLink
          aria-label={slide.title}
          className="absolute inset-0 z-10 cursor-pointer rounded-3xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset focus-visible:outline-none"
          href={slide.url}
        />
      )}
      <HeroSlidePromotion slide={slide} />
      <HeroSlideContent
        active={active}
        headingLevel={slideHeadingLevel}
        slide={slide}
      />
    </li>
  );
}

export function HeroCarousel({ data }: { data: CmsHeroData }) {
  const { ariaLabel, autoplay, autoplayIntervalMs, headingLevel, slides } =
    data;
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
    <Container
      as="section"
      aria-label={ariaLabel || "Aktuelle Angebote und Kollektionen"}
      aria-roledescription="Karussell"
      className="mt-2"
      data-cms-element="jv-hero"
      onBlurCapture={handleBlur}
      onFocusCapture={() => setIsInteracting(true)}
      onPointerEnter={() => setIsInteracting(true)}
      onPointerLeave={() => setIsInteracting(false)}
    >
      <div className="relative isolate min-h-136 overflow-hidden rounded-3xl bg-muted text-background sm:min-h-168">
        <ul>
          {slides.map((slide, index) => (
            <HeroSlide
              active={index === activeIndex}
              headingLevel={headingLevel}
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
      </div>
    </Container>
  );
}
