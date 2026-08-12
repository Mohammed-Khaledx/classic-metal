"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { fmt } from "@/lib/format";
import { prefersReducedMotion } from "@/lib/use-animations";

export function AnimatedNumber({
  value,
  className,
  duration = 0.45,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.textContent = fmt(value);
      prev.current = value;
      return;
    }

    const obj = { v: prev.current };
    const tween = gsap.to(obj, {
      v: value,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = fmt(Math.round(obj.v));
      },
      onComplete: () => {
        el.textContent = fmt(value);
      },
    });

    prev.current = value;
    return () => {
      tween.kill();
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {fmt(value)}
    </span>
  );
}