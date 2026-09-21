"use client";

import { useEffect, useRef, useState } from "react";

type ProductRailScrollState = Readonly<{
  canScrollBack: boolean;
  canScrollForward: boolean;
}>;

const initialProductRailScrollState: ProductRailScrollState = {
  canScrollBack: false,
  canScrollForward: false,
};

export function useProductRail(productCount: number) {
  const railRef = useRef<HTMLUListElement>(null);
  const [scrollState, setScrollState] = useState<ProductRailScrollState>(
    initialProductRailScrollState,
  );

  useEffect(() => {
    const rail = railRef.current;

    if (!rail) return;

    const railElement = rail;

    let animationFrame: number | null = null;

    function updateScrollState() {
      animationFrame = null;
      const maximumScrollLeft =
        railElement.scrollWidth - railElement.clientWidth;
      const canScrollBack = railElement.scrollLeft > 2;
      const canScrollForward = railElement.scrollLeft < maximumScrollLeft - 2;

      setScrollState((currentState) =>
        currentState.canScrollBack === canScrollBack &&
        currentState.canScrollForward === canScrollForward
          ? currentState
          : { canScrollBack, canScrollForward },
      );
    }

    function requestScrollStateUpdate() {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateScrollState);
      }
    }

    requestScrollStateUpdate();
    railElement.addEventListener("scroll", requestScrollStateUpdate, {
      passive: true,
    });
    window.addEventListener("resize", requestScrollStateUpdate);

    return () => {
      railElement.removeEventListener("scroll", requestScrollStateUpdate);
      window.removeEventListener("resize", requestScrollStateUpdate);

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [productCount]);

  function scrollRail(direction: -1 | 1) {
    const rail = railRef.current;

    if (!rail) return;

    rail.scrollBy({
      behavior: "smooth",
      left: direction * Math.max(rail.clientWidth * 0.8, 280),
    });
  }

  return { railRef, scrollRail, ...scrollState };
}
