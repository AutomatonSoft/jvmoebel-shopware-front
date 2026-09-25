"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Maximize2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import type { ShopProductDetail } from "@/features/catalog/model/product-detail";

type ProductGalleryProps = Readonly<{
  badge?: string;
  images: ShopProductDetail["gallery"];
}>;

export function ProductGallery({ badge, images }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isFullscreenImageLoading, setIsFullscreenImageLoading] =
    useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const loadedFullscreenImageUrls = useRef(new Set<string>());
  const loadedImageUrls = useRef(new Set<string>());
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
  function showImage(index: number) {
    if (index === activeImageIndex) {
      return;
    }

    const image = images[index];

    if (!image) {
      return;
    }

    setIsImageLoading(!loadedImageUrls.current.has(image.url));
    if (isFullscreenOpen) {
      setIsFullscreenImageLoading(
        !loadedFullscreenImageUrls.current.has(image.url),
      );
    }
    setActiveImageIndex(index);
  }

  function handleFullscreenOpenChange(open: boolean) {
    setIsFullscreenOpen(open);
    setIsFullscreenImageLoading(
      open && !loadedFullscreenImageUrls.current.has(activeImage.url),
    );
  }

  function showPreviousImage() {
    showImage(
      activeImageIndex === 0 ? images.length - 1 : activeImageIndex - 1,
    );
  }

  function showNextImage() {
    showImage(
      activeImageIndex === images.length - 1 ? 0 : activeImageIndex + 1,
    );
  }

  return (
    <div
      className={`grid min-w-0 gap-3 ${hasMultipleImages ? "sm:relative sm:block sm:pl-[5.75rem]" : ""}`}
    >
      {hasMultipleImages && (
        <div className="order-2 flex gap-2 overflow-x-auto pb-1 sm:absolute sm:inset-y-0 sm:left-0 sm:w-20 sm:flex-col sm:overflow-x-visible sm:overflow-y-auto sm:pb-0 sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden">
          {images.map((image, index) => {
            const isActive = index === activeImageIndex;

            return (
              <button
                aria-label={`Produktbild ${index + 1} anzeigen`}
                aria-pressed={isActive}
                className={`relative aspect-square w-18 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 bg-muted transition-[border-color,opacity,transform] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-full ${isActive ? "border-primary" : "border-transparent"}`}
                key={image.url}
                onClick={() => showImage(index)}
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

      <Dialog.Root onOpenChange={handleFullscreenOpenChange}>
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
              onError={() => setIsImageLoading(false)}
              onLoad={() => {
                loadedImageUrls.current.add(activeImage.url);
                setIsImageLoading(false);
              }}
              ref={zoomImageRef}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) calc(100vw - 8rem), 58vw"
              src={activeImage.url}
            />
            {isImageLoading && (
              <span
                aria-live="polite"
                className="absolute inset-0 grid place-items-center bg-muted/80 text-muted-foreground"
                role="status"
              >
                <span className="grid size-14 place-items-center rounded-full border border-white/80 bg-background/95 text-primary shadow-[0_12px_30px_-16px_rgba(21,21,19,0.55)]">
                  <LoaderCircle
                    aria-hidden="true"
                    className="size-6 animate-spin"
                  />
                </span>
                <span className="sr-only">Produktbild wird geladen</span>
              </span>
            )}
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
                onError={() => setIsFullscreenImageLoading(false)}
                onLoad={() => {
                  loadedFullscreenImageUrls.current.add(activeImage.url);
                  setIsFullscreenImageLoading(false);
                }}
                sizes="100vw"
                src={activeImage.url}
              />
              {isFullscreenImageLoading && (
                <span
                  aria-live="polite"
                  className="pointer-events-none absolute inset-0 grid place-items-center text-primary"
                  role="status"
                >
                  <LoaderCircle
                    aria-hidden="true"
                    className="size-9 animate-spin drop-shadow-sm"
                  />
                  <span className="sr-only">Produktbild wird geladen</span>
                </span>
              )}
              {hasMultipleImages && (
                <>
                  <button
                    aria-label="Vorheriges Produktbild"
                    className="absolute top-1/2 left-2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur transition-[background,transform] hover:bg-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:left-5 sm:size-12"
                    onClick={showPreviousImage}
                    type="button"
                  >
                    <ChevronLeft
                      aria-hidden="true"
                      className="size-5 sm:size-6"
                    />
                  </button>
                  <button
                    aria-label="Nächstes Produktbild"
                    className="absolute top-1/2 right-2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur transition-[background,transform] hover:bg-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:right-5 sm:size-12"
                    onClick={showNextImage}
                    type="button"
                  >
                    <ChevronRight
                      aria-hidden="true"
                      className="size-5 sm:size-6"
                    />
                  </button>
                  <span className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-foreground/75 px-3 py-1.5 text-[0.65rem] font-semibold text-background backdrop-blur sm:bottom-5">
                    {activeImageIndex + 1} / {images.length}
                  </span>
                </>
              )}
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
