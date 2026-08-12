"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, ReceiptText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfig, useQuotes, removeQuote } from "@/lib/stores";
import { money, fmt, fmtArea } from "@/lib/format";
import { useReveal } from "@/lib/use-animations";
import { BrandLoader } from "@/components/brand-loader";
import type { Quote } from "@/lib/types";

export default function QuotesPage() {
  const { quotes, ready } = useQuotes();
  const { config } = useConfig();
  const router = useRouter();
  const rootRef = useReveal<HTMLDivElement>([ready]);

  const productName = (productId: string): string => {
    const found = config?.find((p) => p.id === productId);
    return found?.name ?? productId;
  };

  function handleDelete(quote: Quote) {
    if (window.confirm("تتأكد إنك عايز تشيل العرض ده؟")) {
      removeQuote(quote.id);
    }
  }

  if (!ready) {
    return <BrandLoader label="بيحمّل العروض" />;
  }

  if (quotes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted">
          <ReceiptText className="h-8 w-8 text-muted-foreground" />
        </span>
        <div>
          <p className="font-bold">مفيش عروض محفوظة لسه</p>
          <p className="mt-1 text-sm text-muted-foreground">
            اعمل حسابك الأول وهيظهر هنا تلقائياً
          </p>
        </div>
        <Button asChild>
          <Link href="/">احسب دلوقتي</Link>
        </Button>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="flex flex-col gap-3">
      <h1 className="text-xl font-bold tracking-tight" data-reveal>العروض المحفوظة</h1>
      <p className="-mt-2 text-[13px] text-muted-foreground" data-reveal>
        {quotes.length} عرض — كلهم محفوظين على جهازك
      </p>

      {quotes.map((quote) => {
        const product = config?.find((p) => p.id === quote.productId);
        return (
          <Card key={quote.id} className="rounded-3xl shadow-sm" data-reveal>
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="flex items-center gap-2 font-bold">
                    {productName(quote.productId)}
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {money(quote.total)}
                    </span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(quote.createdAt).toLocaleDateString("ar-EG", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(quote)}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  title="مسح العرض"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <p className="font-geist text-[13px] tabular-nums">
                {fmt(quote.widthCm)} × {fmt(quote.heightCm)} سم ={" "}
                {fmtArea((quote.widthCm * quote.heightCm) / 10000)}
              </p>

              {Object.entries(quote.selected).map(([groupId, choiceIds]) => {
                const group = product?.groups.find((g) => g.id === groupId);
                if (!group || choiceIds.length === 0) return null;
                const labels = choiceIds
                  .map((cid) => group.choices.find((c) => c.id === cid)?.label)
                  .filter(Boolean);
                if (labels.length === 0) return null;
                return (
                  <p key={groupId} className="text-xs text-muted-foreground">
                    {group.label}:{" "}
                    <span className="font-medium text-foreground">
                      {labels.join("، ")}
                    </span>
                  </p>
                );
              })}

              {quote.note && (
                <p className="rounded-2xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                  {quote.note}
                </p>
              )}

              <Button
                variant="outline"
                className="gap-1.5 rounded-2xl"
                onClick={() => router.push(`/calc/${quote.productId}?quote=${quote.id}`)}
              >
                <ArrowLeft className="h-4 w-4" />
                فتح العرض وتعديله
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}