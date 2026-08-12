import type { PriceBreakdown } from "./pricing";
import { fmt, money } from "./format";

export function buildQuoteText(opts: {
  productName: string;
  dims: string;
  breakdown: PriceBreakdown;
  discountPct: number;
  note: string;
}): string {
  const { productName, dims, breakdown, discountPct, note } = opts;
  const bar = "—".repeat(22);
  const lines: string[] = [
    "🗂 *كلاسيك ميتال — عرض سعر*",
    `📦 المنتج: *${productName}*`,
    `📐 المقاس: ${dims}`,
    `📏 المساحة: ${fmt(breakdown.area)} م²`,
    bar,
  ];

  for (const line of breakdown.lines) {
    const suffix =
      line.kind === "perM2"
        ? ` (+${fmt(line.price)} ج/م²)`
        : ` (+${fmt(line.price)} ج ثابت)`;
    lines.push(`• ${line.choiceLabel} ${suffix}`);
  }

  lines.push(
    bar,
    `سعر المتر: ${money(breakdown.perM2Total)}`,
    `الإجمالي قبل الخصم: ${money(breakdown.subtotal)}`
  );

  if (discountPct > 0) {
    lines.push(`خصم ${discountPct}٪: -${money(breakdown.discount)}`);
  }

  lines.push(`💰 *الإجمالي النهائي: ${money(breakdown.total)}*`);

  if (note.trim()) {
    lines.push("", `📝 ملاحظات: ${note.trim()}`);
  }

  return lines.join("\n");
}

export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}