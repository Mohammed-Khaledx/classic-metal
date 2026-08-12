import type { ProductConfig, Selection } from "./types";

export interface PriceLine {
  groupLabel: string;
  choiceLabel: string;
  kind: "perM2" | "fixed";
  price: number;
}

export interface PriceBreakdown {
  area: number;
  perM2Total: number;
  fixedTotal: number;
  subtotal: number;
  discount: number;
  total: number;
  lines: PriceLine[];
}

export function calcArea(widthCm: number, heightCm: number): number {
  if (!Number.isFinite(widthCm) || !Number.isFinite(heightCm)) return 0;
  if (widthCm <= 0 || heightCm <= 0) return 0;
  return Math.round((widthCm * heightCm) / 10000 * 100) / 100;
}

export function roundToTen(n: number): number {
  return Math.round(n / 10) * 10;
}

export function calculatePrice(
  product: ProductConfig,
  widthCm: number,
  heightCm: number,
  selected: Selection,
  discountPct = 0
): PriceBreakdown {
  const area = calcArea(widthCm, heightCm);
  let perM2Total = product.basePricePerM2;
  let fixedTotal = 0;
  const lines: PriceLine[] = [];

  for (const group of product.groups) {
    const choiceIds = selected[group.id] ?? [];
    for (const choiceId of choiceIds) {
      const choice = group.choices.find((c) => c.id === choiceId);
      if (!choice) continue;
      if (choice.kind === "perM2") perM2Total += choice.price;
      else fixedTotal += choice.price;
      lines.push({
        groupLabel: group.label,
        choiceLabel: choice.label,
        kind: choice.kind,
        price: choice.price,
      });
    }
  }

  const subtotal = area * perM2Total + fixedTotal;
  const discount =
    discountPct > 0 ? Math.round((subtotal * discountPct) / 100) : 0;
  const total = roundToTen(Math.max(0, subtotal - discount));

  return {
    area,
    perM2Total,
    fixedTotal,
    subtotal: Math.round(subtotal),
    discount,
    total,
    lines,
  };
}

export function defaultSelection(product: ProductConfig): Selection {
  const selection: Selection = {};
  for (const group of product.groups) {
    if (group.single && group.choices.length > 0) {
      selection[group.id] = [group.choices[0].id];
    }
  }
  return selection;
}