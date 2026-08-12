"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChefHat, Disc3 } from "lucide-react";
import { DEFAULT_CONFIG } from "@/lib/defaults";
import { money } from "@/lib/format";
import { usePopIn, useReveal } from "@/lib/use-animations";

const productPhotos: Record<string, string> = {
  window: "/products/window.jpg",
  kitchen: "/products/kitchen.jpg",
};

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  window: Disc3,
  kitchen: ChefHat,
};

export default function HomePage() {
  const rootRef = useReveal<HTMLDivElement>([]);
  const logoRef = usePopIn<HTMLImageElement>([]);

  return (
    <div ref={rootRef} className="flex flex-col gap-5">
      <section className="mt-2 flex flex-col items-center gap-3 pt-4 pb-2 text-center">
        <div className="rounded-full bg-muted p-1.5" data-reveal>
          <Image
            ref={logoRef}
            src="/logo.jpg"
            alt="Classic Metal"
            width={72}
            height={72}
            className="h-[72px] w-[72px] rounded-full object-cover shadow-sm"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-reveal>
            أهلاً بيك في <span className="text-bronze">Classic Metal</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground" data-reveal>
            احسب سعر المطبخ أو الشباك بالمتر المربع في ثوانٍ وردّ على زبونك
            فوراً
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        {DEFAULT_CONFIG.map((product) => {
          const Icon = icons[product.id] ?? Disc3;
          return (
            <Link
              key={product.id}
              href={`/calc/${product.id}`}
              data-reveal
              className="group relative block overflow-hidden rounded-3xl border bg-card shadow-sm transition-shadow hover:shadow-lg active:scale-[0.99]"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={productPhotos[product.id] ?? "/logo.jpg"}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 448px) 100vw, 448px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute start-3 top-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-lg font-bold text-white">
                      {product.name}
                    </p>
                    <p className="text-xs text-white/85">
                      سعر المتر يبدأ من{" "}
                      <span className="font-geist font-semibold tabular-nums">
                        {money(product.basePricePerM2)}
                      </span>
                    </p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-transform group-hover:-translate-x-1">
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      <p
        data-reveal
        className="px-4 text-center text-xs leading-relaxed text-muted-foreground"
      >
        الأسعار تتظبط بالعقل من صفحة الإعدادات — كل قطاع وكل إضافة ليهم سعرهم
        اللي تقدر تغيّره في أي وقت
      </p>
    </div>
  );
}