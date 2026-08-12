import type { ProductsConfig } from "./types";

export const CONFIG_KEY = "classic-metal:config";
export const QUOTES_KEY = "classic-metal:quotes";

export const DEFAULT_CONFIG: ProductsConfig = [
  {
    id: "window",
    name: "شباك",
    basePricePerM2: 1800,
    groups: [
      {
        id: "sector",
        label: "نوع القطاع",
        single: true,
        choices: [
          { id: "w-s1", label: "قطاع عادي", kind: "perM2", price: 0 },
          { id: "w-s2", label: "قطاع إمبراطور", kind: "perM2", price: 380 },
          { id: "w-s3", label: "قطاع سانياتو", kind: "perM2", price: 650 },
        ],
      },
      {
        id: "glass",
        label: "نوع الزجاج",
        single: true,
        choices: [
          { id: "w-g1", label: "زجاج 4 مم", kind: "perM2", price: 0 },
          { id: "w-g2", label: "زجاج دبل 6 مم", kind: "perM2", price: 950 },
          { id: "w-g3", label: "زجاج دبل 8 مم", kind: "perM2", price: 1450 },
        ],
      },
      {
        id: "opening",
        label: "طريقة الفتح",
        single: true,
        choices: [
          { id: "w-o1", label: "ثابت", kind: "perM2", price: 0 },
          { id: "w-o2", label: "قلب", kind: "perM2", price: 180 },
          { id: "w-o3", label: "انزلاق", kind: "perM2", price: 350 },
          { id: "w-o4", label: "معلق", kind: "perM2", price: 280 },
        ],
      },
      {
        id: "extras",
        label: "إضافات",
        single: false,
        choices: [
          { id: "w-e1", label: "شيش حصيرة", kind: "perM2", price: 450 },
          { id: "w-e2", label: "مفتاح بقفل", kind: "fixed", price: 200 },
          { id: "w-e3", label: "مسارة + شبك", kind: "perM2", price: 150 },
        ],
      },
    ],
  },
  {
    id: "kitchen",
    name: "مطبخ",
    basePricePerM2: 4200,
    groups: [
      {
        id: "sector",
        label: "نوع القطاع",
        single: true,
        choices: [
          { id: "k-s1", label: "قطاع إسباني", kind: "perM2", price: 0 },
          { id: "k-s2", label: "قطاع إيطالي", kind: "perM2", price: 1600 },
          { id: "k-s3", label: "قطاع هاندنيتس", kind: "perM2", price: 2800 },
        ],
      },
      {
        id: "body",
        label: "جسم الخزائن",
        single: true,
        choices: [
          { id: "k-b1", label: "بورد عادي", kind: "perM2", price: 0 },
          { id: "k-b2", label: "بورد سوبر", kind: "perM2", price: 500 },
        ],
      },
      {
        id: "finish",
        label: "تشطيب الواجهات",
        single: true,
        choices: [
          { id: "k-f1", label: "كريستال معالج", kind: "perM2", price: 0 },
          { id: "k-f2", label: "ألوميتال", kind: "perM2", price: 400 },
          { id: "k-f3", label: "زجاج", kind: "perM2", price: 350 },
        ],
      },
      {
        id: "accessories",
        label: "إكسسوارات",
        single: false,
        choices: [
          { id: "k-a1", label: "ترابيع + كراسي هيدروليك", kind: "fixed", price: 800 },
          { id: "k-a2", label: "سلك بلاتينيوم", kind: "fixed", price: 450 },
          { id: "k-a3", label: "مخارج ترابيع", kind: "fixed", price: 350 },
        ],
      },
    ],
  },
];