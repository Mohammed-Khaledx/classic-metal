"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfig, saveConfig, resetConfig } from "@/lib/stores";
import { DEFAULT_CONFIG } from "@/lib/defaults";
import { money } from "@/lib/format";
import { BrandLoader } from "@/components/brand-loader";
import type {
  OptionChoice,
  OptionGroup,
  ProductConfig,
  ProductsConfig,
} from "@/lib/types";

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export default function SettingsPage() {
  const { ready } = useConfig();
  const [resetKey, setResetKey] = useState(0);

  if (!ready) {
    return <BrandLoader label="بيحمّل الأسعار" />;
  }

  return (
    <SettingsEditor
      key={resetKey}
      onReset={() => {
        if (!window.confirm("ترجع فعلاً للأسعار الافتراضية؟")) return;
        resetConfig();
        setResetKey((k) => k + 1);
        toast("تمت الاستعادة للأسعار الافتراضية");
      }}
    />
  );
}

function SettingsEditor({ onReset }: { onReset: () => void }) {
  const { config } = useConfig();
  const [draft, setDraft] = useState<ProductsConfig>(() =>
    JSON.parse(JSON.stringify(config ?? DEFAULT_CONFIG))
  );

  const baseline = JSON.stringify(config ?? DEFAULT_CONFIG);
  const isEdited = JSON.stringify(draft) !== baseline;

  function updateProduct(
    productId: string,
    updater: (p: ProductConfig) => ProductConfig
  ) {
    setDraft((curr) =>
      curr.map((p) => (p.id === productId ? updater(p) : p))
    );
  }

  function updateGroup(
    product: ProductConfig,
    groupId: string,
    updater: (g: OptionGroup) => OptionGroup
  ) {
    updateProduct(product.id, (p) => ({
      ...p,
      groups: p.groups.map((g) => (g.id === groupId ? updater(g) : g)),
    }));
  }

  function updateChoice(
    group: OptionGroup,
    choiceId: string,
    updater: (c: OptionChoice) => OptionChoice
  ) {
    setDraft((curr) =>
      curr.map((p) => ({
        ...p,
        groups: p.groups.map((g) =>
          g.id === group.id
            ? {
                ...g,
                choices: g.choices.map((c) =>
                  c.id === choiceId ? updater(c) : c
                ),
              }
            : g
        ),
      }))
    );
  }

  function handleSave() {
    saveConfig(draft);
    toast.success("اتحفظت الأسعار — التطبيق اتحدث فوراً");
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">إعدادات الأسعار</h1>
        <p className="text-[13px] text-muted-foreground">
          عدّل أسعار المتر والإضافات — التغييرات بتنفذ في ثواني
        </p>
      </div>

      <div className="sticky top-16 z-30 flex gap-2">
        <Button
          onClick={handleSave}
          disabled={!isEdited}
          className="flex-1 gap-1.5 rounded-2xl"
        >
          <Save className="h-4 w-4" />
          حفظ التعديلات
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="gap-1.5 rounded-2xl"
          title="استعادة الأسعار الافتراضية"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {draft.map((product) => (
        <Card key={product.id} className="rounded-3xl shadow-sm">
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-bold">{product.name}</p>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
                {money(product.basePricePerM2)}/م²
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>سعر المتر الأساسي (ج/م²)</Label>
              <div className="relative">
                <Input
                  type="number"
                  inputMode="decimal"
                  value={product.basePricePerM2}
                  onChange={(e) =>
                    updateProduct(product.id, (p) => ({
                      ...p,
                      basePricePerM2: Number(e.target.value) || 0,
                    }))
                  }
                  className="font-geist pe-14 tabular-nums"
                />
                <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-xs text-muted-foreground">
                  ج.م/م²
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {product.groups.map((group) => (
                <div
                  key={group.id}
                  className="flex flex-col gap-3 rounded-2xl border bg-muted/40 p-3"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      value={group.label}
                      onChange={(e) =>
                        updateGroup(product, group.id, (g) => ({
                          ...g,
                          label: e.target.value,
                        }))
                      }
                      className="h-9 flex-1 rounded-xl bg-card text-sm font-bold"
                    />
                    <div className="flex overflow-hidden rounded-xl border bg-card text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          updateGroup(product, group.id, (g) => ({
                            ...g,
                            single: true,
                          }))
                        }
                        className={`px-2.5 py-2 transition-colors ${
                          group.single ? "bg-primary text-primary-foreground" : ""
                        }`}
                      >
                        واحد
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateGroup(product, group.id, (g) => ({
                            ...g,
                            single: false,
                          }))
                        }
                        className={`px-2.5 py-2 transition-colors ${
                          !group.single ? "bg-primary text-primary-foreground" : ""
                        }`}
                      >
                        متعدد
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateProduct(product.id, (p) => ({
                          ...p,
                          groups: p.groups.filter((g) => g.id !== group.id),
                        }))
                      }
                      className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {group.choices.map((choice) => (
                    <div key={choice.id} className="flex items-center gap-2">
                      <Input
                        value={choice.label}
                        onChange={(e) =>
                          updateChoice(group, choice.id, (c) => ({
                            ...c,
                            label: e.target.value,
                          }))
                        }
                        className="h-9 min-w-0 flex-[1.4] rounded-xl bg-card text-[13px]"
                      />
                      <select
                        value={choice.kind}
                        onChange={(e) =>
                          updateChoice(group, choice.id, (c) => ({
                            ...c,
                            kind: e.target.value as OptionChoice["kind"],
                          }))
                        }
                        className="h-9 rounded-xl border bg-card px-1.5 text-xs text-muted-foreground"
                      >
                        <option value="perM2">لكل م²</option>
                        <option value="fixed">ثابت</option>
                      </select>
                      <div className="relative min-w-0 flex-1">
                        <Input
                          type="number"
                          inputMode="decimal"
                          value={choice.price}
                          onChange={(e) =>
                            updateChoice(group, choice.id, (c) => ({
                              ...c,
                              price: Number(e.target.value) || 0,
                            }))
                          }
                          className="font-geist h-9 pe-6 rounded-xl bg-card text-[13px] tabular-nums"
                        />
                        <span className="pointer-events-none absolute inset-y-0 end-2 flex items-center text-[10px] text-muted-foreground">
                          ج
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((curr) =>
                            curr.map((p) => ({
                              ...p,
                              groups: p.groups.map((g) =>
                                g.id === group.id
                                  ? {
                                      ...g,
                                      choices: g.choices.filter(
                                        (c) => c.id !== choice.id
                                      ),
                                    }
                                  : g
                              ),
                            }))
                          )
                        }
                        className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        title="مسح الاختيار"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateGroup(product, group.id, (g) => ({
                        ...g,
                        choices: [
                          ...g.choices,
                          {
                            id: uid(),
                            label: "إضافة جديدة",
                            kind: "perM2",
                            price: 0,
                          },
                        ],
                      }))
                    }
                    className="h-9 gap-1 rounded-xl self-start text-[13px]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    إضافة اختيار
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() =>
                updateProduct(product.id, (p) => ({
                  ...p,
                  groups: [
                    ...p.groups,
                    {
                      id: uid(),
                      label: "مجموعة جديدة",
                      single: true,
                      choices: [
                        {
                          id: uid(),
                          label: "اختيار جديد",
                          kind: "perM2",
                          price: 0,
                        },
                      ],
                    },
                  ],
                }))
              }
              className="gap-1.5 rounded-2xl"
            >
              <Plus className="h-4 w-4" />
              إضافة مجموعة
            </Button>
          </CardContent>
        </Card>
      ))}

      <p className="px-4 pb-2 text-center text-xs leading-relaxed text-muted-foreground">
        الأسعار محفوظة على المتصفح بس — لو بدلت الجهاز أو مسحت البيانات هترجع
        للأسعار الافتراضية
      </p>
    </div>
  );
}