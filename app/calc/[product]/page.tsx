"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ChefHat, Copy, Save, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OptionChips } from "@/components/option-chips";
import { AnimatedNumber } from "@/components/animated-number";
import { BrandLoader } from "@/components/brand-loader";
import { useReveal } from "@/lib/use-animations";
import { useConfig, addQuote } from "@/lib/stores";
import { DEFAULT_CONFIG } from "@/lib/defaults";
import { calculatePrice, defaultSelection } from "@/lib/pricing";
import { buildQuoteText, whatsappShareUrl } from "@/lib/quote-text";
import { money, fmt, fmtArea, fmtDims } from "@/lib/format";
import type { ProductConfig, Quote, Selection } from "@/lib/types";

interface InitialState {
  widthCm: number;
  heightCm: number;
  selected: Selection;
  discountPct: number;
  note: string;
}

function loadInitial(
  product: ProductConfig,
  defs: { width: number; height: number }
): InitialState {
  return {
    widthCm: defs.width,
    heightCm: defs.height,
    selected: defaultSelection(product),
    discountPct: 0,
    note: "",
  };
}

export default function CalcPage() {
  const params = useParams<{ product: string }>();
  const productId = params.product;
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quote");
  const { config, ready } = useConfig();

  const products = config ?? DEFAULT_CONFIG;
  const product = products.find((p) => p.id === productId);

  if (!ready) {
    return <BrandLoader label="بيحمّل الأسعار" />;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-sm text-muted-foreground">المنتج مش موجود</p>
        <Button asChild>
          <Link href="/">الرئيسية</Link>
        </Button>
      </div>
    );
  }

  return (
    <CalcInner
      key={`${product.id}:${quoteId ?? "new"}`}
      product={product}
      products={products}
      quoteId={quoteId}
    />
  );
}

function CalcInner({
  product,
  products,
  quoteId,
}: {
  product: ProductConfig;
  products: ProductConfig[];
  quoteId: string | null;
}) {
  const router = useRouter();
  const rootRef = useReveal<HTMLDivElement>([product.id]);
  const [initial] = useState(() =>
    loadInitial(product, { width: 120, height: 150 })
  );
  const [widthCm, setWidthCm] = useState(() =>
    initial.widthCm ? String(initial.widthCm) : ""
  );
  const [heightCm, setHeightCm] = useState(() =>
    initial.heightCm ? String(initial.heightCm) : ""
  );
  const [selected, setSelected] = useState<Selection>(initial.selected);
  const [discountPct, setDiscountPct] = useState(() =>
    String(initial.discountPct)
  );
  const [note, setNote] = useState(initial.note);

  useEffect(() => {
    if (!quoteId) return;
    const raw = window.localStorage.getItem("classic-metal:quotes");
    if (!raw) return;
    try {
      const quotes = JSON.parse(raw) as Quote[];
      const quote = quotes.find(
        (q) => q.id === quoteId && q.productId === product.id
      );
      if (quote) {
        /* eslint-disable react-hooks/set-state-in-effect */
        setWidthCm(quote.widthCm ? String(quote.widthCm) : "");
        setHeightCm(quote.heightCm ? String(quote.heightCm) : "");
        setSelected(quote.selected);
        setDiscountPct(String(quote.discountPct));
        setNote(quote.note);
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {
      /* ignore */
    }
  }, [quoteId, product.id]);

  const breakdown = useMemo(
    () =>
      calculatePrice(
        product,
        Number(widthCm) || 0,
        Number(heightCm) || 0,
        selected,
        Number(discountPct) || 0
      ),
    [product, widthCm, heightCm, selected, discountPct]
  );

  function toggleChoice(groupId: string, choiceId: string) {
    setSelected((prev) => {
      const group = product.groups.find((g) => g.id === groupId);
      const current = prev[groupId] ?? [];
      if (group?.single) {
        return { ...prev, [groupId]: [choiceId] };
      }
      return {
        ...prev,
        [groupId]: current.includes(choiceId)
          ? current.filter((id) => id !== choiceId)
          : [...current, choiceId],
      };
    });
  }

  function handleSave() {
    if (breakdown.area <= 0) {
      toast.error("اكتب المقاسات الأول");
      return;
    }
    const quote: Quote = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      productId: product.id,
      widthCm: Number(widthCm) || 0,
      heightCm: Number(heightCm) || 0,
      selected,
      discountPct: Number(discountPct) || 0,
      note: note.trim(),
      total: breakdown.total,
    };
    addQuote(quote);
    toast.success("تم حفظ العرض — تلاقيه في تبويب العروض");
  }

  async function handleCopy() {
    if (breakdown.area <= 0) {
      toast.error("اكتب المقاسات الأول");
      return;
    }
    const text = buildQuoteText({
      productName: product.name,
      dims: fmtDims(Number(widthCm) || 0, Number(heightCm) || 0),
      breakdown,
      discountPct: Number(discountPct) || 0,
      note,
    });
    try {
      await navigator.clipboard.writeText(text);
      toast.success("اتنسخ العرض — الصقه في الواتساب");
    } catch {
      window.prompt("انسخ العرض ده:", text);
    }
  }

  function handleWhatsApp() {
    if (breakdown.area <= 0) {
      toast.error("اكتب المقاسات الأول");
      return;
    }
    const text = buildQuoteText({
      productName: product.name,
      dims: fmtDims(Number(widthCm) || 0, Number(heightCm) || 0),
      breakdown,
      discountPct: Number(discountPct) || 0,
      note,
    });
    window.open(whatsappShareUrl(text), "_blank");
  }

  function handleClear() {
    setWidthCm("");
    setHeightCm("");
    setDiscountPct("0");
    setNote("");
    setSelected(defaultSelection(product));
    toast("تم مسح القيم");
  }

  return (
    <div ref={rootRef} className="flex flex-col gap-4 pb-28">
      <div className="flex items-center justify-between" data-reveal>
        <div className="flex gap-2">
          {products.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => router.push(`/calc/${p.id}`)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                p.id === product.id
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "bg-card hover:bg-muted"
              }`}
            >
              {p.id === "kitchen" ? (
                <ChefHat className="h-4 w-4" />
              ) : (
                <span className="text-base leading-none">🪟</span>
              )}
              {p.name}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-1 rounded-full px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Trash2 className="h-3.5 w-3.5" />
          مسح
        </button>
      </div>

      <div className="relative h-32 w-full overflow-hidden rounded-3xl" data-reveal>
        <Image
          src={
            product.id === "kitchen"
              ? "/products/kitchen.jpg"
              : "/products/window.jpg"
          }
          alt={product.name}
          fill
          priority
          sizes="(max-width: 448px) 100vw, 448px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-3 start-4">
          <p className="text-lg font-bold text-white">{product.name}</p>
          <p className="text-xs text-white/85">
            احسب السعر بالثانية — اختر المقاسات والقطاع
          </p>
        </div>
      </div>

      <Card className="rounded-3xl shadow-sm" data-reveal>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="width">العرض</Label>
              <div className="relative">
                <Input
                  id="width"
                  type="number"
                  inputMode="decimal"
                  placeholder="120"
                  value={widthCm}
                  onChange={(e) => setWidthCm(e.target.value)}
                  className="font-geist pe-10 tabular-nums"
                />
                <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-xs text-muted-foreground">
                  سم
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="height">الارتفاع</Label>
              <div className="relative">
                <Input
                  id="height"
                  type="number"
                  inputMode="decimal"
                  placeholder="150"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="font-geist pe-10 tabular-nums"
                />
                <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-xs text-muted-foreground">
                  سم
                </span>
              </div>
            </div>
          </div>
          <p className="-mt-2 text-[13px] text-muted-foreground">
            المساحة:{" "}
            <span className="font-geist font-semibold text-foreground tabular-nums">
              {fmtArea(breakdown.area)}
            </span>
          </p>
        </CardContent>
      </Card>

      {product.groups.map((group) => (
        <Card key={group.id} className="rounded-3xl shadow-sm" data-reveal>
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-bold">{group.label}</p>
              {!group.single && (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
                  متعدد
                </span>
              )}
            </div>
            <OptionChips
              group={group}
              selected={selected[group.id] ?? []}
              onToggle={(choiceId) => toggleChoice(group.id, choiceId)}
            />
          </CardContent>
        </Card>
      ))}

      <Card className="rounded-3xl shadow-sm" data-reveal>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="discount">خصم إضافي</Label>
            <div className="relative">
              <Input
                id="discount"
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={discountPct}
                onChange={(e) => setDiscountPct(e.target.value)}
                className="font-geist pe-10 tabular-nums"
              />
              <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-xs text-muted-foreground">
                ٪
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="note">ملاحظات (اختياري)</Label>
            <Textarea
              id="note"
              placeholder="مثال: سعر شامل التركيب"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-20 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {breakdown.lines.length > 0 && breakdown.area > 0 && (
        <Card className="rounded-3xl shadow-sm" data-reveal>
          <CardContent className="flex flex-col gap-2 p-5">
            <p className="text-[15px] font-bold">تفاصيل السعر</p>
            {breakdown.lines.map((line) => (
              <div
                key={`${line.groupLabel}-${line.choiceLabel}`}
                className="flex items-center justify-between text-[13px]"
              >
                <span className="text-muted-foreground">
                  {line.choiceLabel}{" "}
                  <span className="text-[11px] text-muted-foreground/70">
                    ({line.kind === "perM2" ? "لكل متر" : "ثابت"})
                  </span>
                </span>
                <span className="font-geist tabular-nums">
                  +{money(line.price)}
                </span>
              </div>
            ))}
            <div className="my-1 border-t" />
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-muted-foreground">سعر المتر</span>
              <span className="font-geist font-medium tabular-nums">
                {money(breakdown.perM2Total)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-muted-foreground">الإجمالي قبل الخصم</span>
              <span className="font-geist font-medium tabular-nums">
                {money(breakdown.subtotal)}
              </span>
            </div>
            {breakdown.discount > 0 && (
              <div className="flex items-center justify-between text-[13px] text-destructive">
                <span>الخصم</span>
                <span className="font-geist tabular-nums">
                  -{money(breakdown.discount)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="fixed inset-x-0 bottom-[4.5rem] z-40 px-4 pb-[env(safe-area-inset-bottom)]" data-reveal>
        <div className="mx-auto flex w-full max-w-md items-center gap-2 rounded-3xl border bg-background/95 p-3 shadow-lg backdrop-blur">
          <div className="min-w-0 flex-1 ps-1">
            <p className="text-[11px] text-muted-foreground">
              {fmtArea(breakdown.area)} •{" "}
              <span className="font-geist tabular-nums">
                {fmt(breakdown.perM2Total)} ج/م²
              </span>
            </p>
            <p className="font-geist text-xl font-bold leading-tight tabular-nums">
              <AnimatedNumber value={breakdown.total} /> ج.م
            </p>
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleSave}
            title="حفظ العرض"
            className="h-11 w-11 shrink-0 rounded-2xl"
          >
            <Save className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleCopy}
            title="نسخ العرض"
            className="h-11 w-11 shrink-0 rounded-2xl"
          >
            <Copy className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleWhatsApp}
            className="h-11 shrink-0 gap-1.5 rounded-2xl px-4"
          >
            <Send className="h-4 w-4" />
            واتساب
          </Button>
        </div>
      </div>
    </div>
  );
}