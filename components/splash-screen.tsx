"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/use-animations";

const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function SplashScreen() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          gsap.set(el, { display: "none" });
        },
      });

      if (prefersReducedMotion()) {
        tl.to({}, { duration: 0.35 });
        return;
      }

      tl.fromTo(
        ".splash-logo",
        { scale: 0.8, y: 10, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.6 },
        0.05
      )
        .fromTo(
          ".splash-ring",
          { strokeDashoffset: RING_CIRCUMFERENCE },
          {
            strokeDashoffset: 0,
            duration: 0.85,
            ease: "power2.inOut",
          },
          0.12
        )
        .fromTo(
          ".splash-glow",
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          0.3
        )
        .fromTo(
          ".splash-glint",
          { xPercent: -130, opacity: 0 },
          {
            xPercent: 130,
            opacity: 0.55,
            duration: 0.55,
            ease: "power2.inOut",
          },
          0.75
        )
        .to(".splash-glint", { opacity: 0, duration: 0.25 }, "-=0.05")
        .fromTo(
          ".splash-brand",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
          "-=0.2"
        )
        .fromTo(
          ".splash-tagline",
          { opacity: 0 },
          { opacity: 1, duration: 0.3 },
          "-=0.15"
        )
        .to(
          el,
          { opacity: 0, scale: 1.03, duration: 0.35, ease: "power2.in" },
          "+=0.2"
        );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-background"
      aria-hidden="true"
    >
      <div className="relative flex h-40 w-40 items-center justify-center">
        <svg
          className="splash-ring-svg absolute -inset-4 h-48 w-48 text-muted -rotate-90"
          viewBox="0 0 120 120"
          fill="none"
        >
          <defs>
            <linearGradient
              id="splash-ring-grad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#cdc9b7" />
              <stop offset="50%" stopColor="#b69c77" />
              <stop offset="100%" stopColor="#cbb485" />
            </linearGradient>
          </defs>
          <circle
            cx="60"
            cy="60"
            r={RING_RADIUS}
            stroke="currentColor"
            strokeWidth="3"
          />
          <circle
            className="splash-ring"
            cx="60"
            cy="60"
            r={RING_RADIUS}
            stroke="url(#splash-ring-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE}
          />
        </svg>

        <div className="splash-logo relative h-40 w-40 overflow-hidden rounded-full shadow-xl ring-1 ring-border">
          <Image
            src="/logo.jpg"
            alt=""
            width={160}
            height={160}
            priority
            className="h-full w-full object-cover"
          />
          <div className="splash-glint" />
        </div>
        <span className="splash-glow absolute -inset-4 -z-10 rounded-full bg-bronze/25 blur-2xl" />
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="splash-brand text-2xl font-bold tracking-tight">
          Classic<span className="text-bronze"> Metal</span>
        </p>
        <p className="splash-tagline text-xs text-muted-foreground">
          تسعير فوري للألوميتال
        </p>
      </div>
    </div>
  );
}
