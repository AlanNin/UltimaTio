import { useEffect, useRef } from "react";

export function useSmoothHorizontalWheelScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let target = el.scrollLeft;
    let rafId: number | null = null;
    let isAnimating = false;
    let isPointerDown = false;
    let wheelTimeout: number | null = null;

    const clamp = (v: number) =>
      Math.max(0, Math.min(v, el.scrollWidth - el.clientWidth));

    const stopAnimation = () => {
      isAnimating = false;
      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const animate = () => {
      const diff = target - el.scrollLeft;
      const step = diff * 0.18;

      if (Math.abs(diff) < 0.5) {
        el.scrollLeft = target;
        rafId = null;
        return;
      }

      el.scrollLeft += step;
      rafId = requestAnimationFrame(animate);
    };

    const onScroll = () => {
      if (!isAnimating || isPointerDown) {
        target = el.scrollLeft;
      }
    };

    const onPointerDown = () => {
      isPointerDown = true;
      stopAnimation();
      target = el.scrollLeft;
    };

    const onPointerUp = () => {
      isPointerDown = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0 && e.deltaX === 0) return;

      e.preventDefault();

      target = el.scrollLeft;

      const unit =
        e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1;

      const delta = (e.deltaY + e.deltaX) * unit;

      target = clamp(target + delta * 2.0);

      isAnimating = true;
      if (rafId == null) {
        rafId = requestAnimationFrame(animate);
      }

      if (wheelTimeout) window.clearTimeout(wheelTimeout);
      wheelTimeout = window.setTimeout(() => {
        isAnimating = false;
        target = el.scrollLeft;
      }, 120);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("wheel", onWheel);
      if (wheelTimeout) window.clearTimeout(wheelTimeout);
      stopAnimation();
    };
  }, []);

  return ref;
}
