"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import type { ShopProductDetail } from "@/features/catalog/model/product-detail";

type ProductGalleryProps = Readonly<{
  badge?: string;
  images: ShopProductDetail["gallery"];
}>;

export function ProductGallery({ badge, images }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = images[activeImageIndex] ?? images[0];
  const hasMultipleImages = images.length > 1;
  const showPreviousImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1,
    );
  };
  const showNextImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1,
    );
  };

  return (
    <div
      className={`grid min-w-0 gap-3 ${hasMultipleImages ? "sm:grid-cols-[5rem_minmax(0,1fr)]" : ""}`}
    >
      {hasMultipleImages && (
        <div className="order-2 flex gap-2 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-x-visible sm:overflow-y-auto sm:pb-0">
          {images.map((image, index) => {
            const isActive = index === activeImageIndex;

            return (
              <button
                aria-label={`Produktbild ${index + 1} anzeigen`}
                aria-pressed={isActive}
                className={`relative aspect-square w-18 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 bg-muted transition-[border-color,opacity,transform] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-full ${isActive ? "border-primary" : "border-transparent"}`}
                key={image.url}
                onClick={() => setActiveImageIndex(index)}
                type="button"
              >
                <Image
                  alt=""
                  className="object-contain"
                  fill
                  sizes="80px"
                  src={image.url}
                />
              </button>
            );
          })}
        </div>
      )}

      <div className="relative order-1 aspect-[0.92] min-w-0 overflow-hidden rounded-2xl bg-muted shadow-[0_0_0_1px_rgba(21,21,19,0.04)] sm:order-2">
        <Image
          alt={activeImage.alt}
          className="object-contain"
          fill
          loading="eager"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) calc(100vw - 8rem), 58vw"
          src={activeImage.url}
        />

        {badge && (
          <span className="absolute top-4 left-4 max-w-[calc(100%-2rem)] truncate rounded-full bg-white/90 px-3 py-1.5 text-[0.625rem] font-semibold tracking-wide text-foreground uppercase backdrop-blur">
            {badge}
          </span>
        )}

        {hasMultipleImages && (
          <>
            <button
              aria-label="Vorheriges Produktbild"
              className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full border bg-background/90 shadow-md backdrop-blur transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:left-4"
              onClick={showPreviousImage}
              type="button"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              aria-label="Nächstes Produktbild"
              className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full border bg-background/90 shadow-md backdrop-blur transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:right-4"
              onClick={showNextImage}
              type="button"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="absolute right-4 bottom-4 rounded-full bg-foreground/75 px-3 py-1.5 text-[0.625rem] font-semibold text-background backdrop-blur">
              {activeImageIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
