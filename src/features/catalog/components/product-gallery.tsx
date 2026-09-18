"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import type { ShopProductDetail } from "@/features/catalog/model/product-detail";

type ProductGalleryProps = Readonly<{
  badge?: string;
  images: ShopProductDetail["gallery"];
}>;

export function ProductGallery({ badge, images }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const zoomImageRef = useRef<HTMLImageElement>(null);
  const activeImage = images[activeImageIndex] ?? images[0];
  const hasMultipleImages = images.length > 1;

  function updateZoomOrigin(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontalPosition =
      ((event.clientX - bounds.left) / bounds.width) * 100;
    const verticalPosition =
      ((event.clientY - bounds.top) / bounds.height) * 100;

    zoomImageRef.current?.style.setProperty(
      "transform-origin",
      `${horizontalPosition}% ${verticalPosition}%`,
    );
  }

  function resetZoomOrigin() {
    zoomImageRef.current?.style.removeProperty("transform-origin");
  }
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
                  unoptimized={image.url.startsWith("http")}
                />
              </button>
            );
          })}
        </div>
      )}

      <Dialog.Root>
        <div className="relative order-1 aspect-[0.92] min-w-0 overflow-hidden rounded-2xl bg-muted shadow-[0_0_0_1px_rgba(21,21,19,0.04)] sm:order-2 lg:aspect-[1.25]">
          <Dialog.Trigger
            aria-label={`Produktbild vergr\u00f6\u00dfern: ${activeImage.alt}`}
            className="group absolute inset-0 z-0 block cursor-zoom-in overflow-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
            onPointerLeave={resetZoomOrigin}
            onPointerMove={updateZoomOrigin}
          >
            <Image
              alt={activeImage.alt}
              className="object-contain transition-transform duration-150 ease-out group-hover:scale-[2]"
              fill
              loading="eager"
              ref={zoomImageRef}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) calc(100vw - 8rem), 58vw"
              src={activeImage.url}
              unoptimized={activeImage.url.startsWith("http")}
            />
            <span className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              <Maximize2 aria-hidden="true" className="size-4" />
            </span>
          </Dialog.Trigger>

          {badge && (
            <span className="pointer-events-none absolute top-4 left-4 z-10 max-w-[calc(100%-2rem)] truncate rounded-full bg-white/90 px-3 py-1.5 text-[0.625rem] font-semibold tracking-wide text-foreground uppercase backdrop-blur">
              {badge}
            </span>
          )}

          {hasMultipleImages && (
            <>
              <button
                aria-label="Vorheriges Produktbild"
                className="absolute top-1/2 left-3 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border bg-background/90 shadow-md backdrop-blur transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:left-4"
                onClick={showPreviousImage}
                type="button"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                aria-label="Nächstes Produktbild"
                className="absolute top-1/2 right-3 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border bg-background/90 shadow-md backdrop-blur transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:right-4"
                onClick={showNextImage}
                type="button"
              >
                <ChevronRight className="size-5" />
              </button>
              <span className="absolute right-4 bottom-4 z-10 rounded-full bg-foreground/75 px-3 py-1.5 text-[0.625rem] font-semibold text-background backdrop-blur">
                {activeImageIndex + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-60 min-h-dvh bg-foreground/75 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
          <Dialog.Viewport className="fixed inset-0 z-70 flex min-h-dvh items-center justify-center p-3 sm:p-6">
            <Dialog.Popup className="relative h-full w-full outline-none">
              <Dialog.Title className="sr-only">{activeImage.alt}</Dialog.Title>
              <Dialog.Description className="sr-only">
                Produktbild in Vollbildansicht
              </Dialog.Description>
              <Image
                alt={activeImage.alt}
                className="object-contain"
                fill
                sizes="100vw"
                src={activeImage.url}
                unoptimized={activeImage.url.startsWith("http")}
              />
              <Dialog.Close
                aria-label="Vollbildansicht schlie\u00dfen"
                className="absolute top-2 right-2 grid size-11 place-items-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:top-4 sm:right-4"
              >
                <X className="size-5" />
              </Dialog.Close>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
