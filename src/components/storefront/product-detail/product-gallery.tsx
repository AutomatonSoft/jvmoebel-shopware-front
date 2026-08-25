"use client";

import Image from "next/image";
import { useState } from "react";

import type { ShopProductDetailMedia } from "@/lib/shopware/product-detail";

export type ProductGalleryProps = {
  badge?: string;
  images: readonly [ShopProductDetailMedia, ...ShopProductDetailMedia[]];
};

export function ProductGallery({ badge, images }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = images[activeImageIndex];

  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-[5rem_minmax(0,1fr)]">
      {images.length > 1 && (
        <div className="order-2 flex gap-2 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-x-visible sm:overflow-y-auto sm:pb-0">
          {images.map((image, index) => {
            const isActive = index === activeImageIndex;

            return (
              <button
                aria-label={`View product image ${index + 1}`}
                aria-pressed={isActive}
                className={`relative aspect-square w-18 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 bg-muted transition-[border-color,opacity,transform] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-full ${isActive ? "border-primary" : "border-transparent"}`}
                key={image.url}
                onClick={() => setActiveImageIndex(index)}
                type="button"
              >
                <Image
                  alt=""
                  className="object-cover"
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
          className="object-cover"
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

        {images.length > 1 && (
          <span className="absolute right-4 bottom-4 rounded-full bg-foreground/75 px-3 py-1.5 text-[0.625rem] font-semibold text-background backdrop-blur sm:hidden">
            {activeImageIndex + 1} / {images.length}
          </span>
        )}
      </div>
    </div>
  );
}
