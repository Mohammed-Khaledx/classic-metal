export function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

export function money(n: number): string {
  return `${fmt(n)} ج.م`;
}

export function fmtArea(area: number): string {
  return `${area.toFixed(2).replace(/\.?0+$/, "")} م²`;
}

export function fmtDims(widthCm: number, heightCm: number): string {
  return `${fmt(widthCm)} × ${fmt(heightCm)} م`;
}