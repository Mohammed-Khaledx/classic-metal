"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Staggered fade/slide-in for every element carrying `data-reveal`
 * inside the returned ref.
 */
export function useReveal<El extends HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<El>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-reveal]",
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.07,
          overwrite: "auto",
        }
      );
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/** Springy pop on a single element (e.g. logo). */
export function usePopIn<El extends HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<El>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scale: 0.72, opacity: 0, rotate: -8 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.65,
          ease: "back.out(1.7)",
        }
      );
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/** Quick elastic pulse used on interactive taps. */
export function pulseTarget(target: HTMLElement) {
  if (prefersReducedMotion()) return;
  gsap.fromTo(
    target,
    { scale: 0.9 },
    { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.45)" }
  );
}