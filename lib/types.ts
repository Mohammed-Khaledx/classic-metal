export type ChoiceKind = "perM2" | "fixed";

export interface OptionChoice {
  id: string;
  label: string;
  kind: ChoiceKind;
  price: number;
}

export interface OptionGroup {
  id: string;
  label: string;
  single: boolean;
  choices: OptionChoice[];
}

export interface ProductConfig {
  id: string;
  name: string;
  basePricePerM2: number;
  groups: OptionGroup[];
}

export type Selection = Record<string, string[]>;

export interface Quote {
  id: string;
  createdAt: string;
  productId: string;
  widthCm: number;
  heightCm: number;
  selected: Selection;
  discountPct: number;
  note: string;
  total: number;
}

export type ProductsConfig = ProductConfig[];