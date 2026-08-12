"use client";

import type { ProductConfig } from "@/lib/types";
import { pulseTarget } from "@/lib/use-animations";

export function OptionChips({
  group,
  selected,
  onToggle,
}: {
  group: ProductConfig["groups"][number];
  selected: string[];
  onToggle: (choiceId: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {group.choices.map((choice) => {
        const isOn = selected.includes(choice.id);
        return (
          <button
            key={choice.id}
            type="button"
            onClick={(e) => {
              pulseTarget(e.currentTarget);
              onToggle(choice.id);
            }}
            className={`rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors active:scale-[0.98] ${
              isOn
                ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-foreground hover:bg-muted"
            }`}
          >
            {choice.label}
            {choice.price > 0 && (
              <span
                className={`ms-1.5 text-[11px] ${
                  isOn ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                +{choice.price.toLocaleString("en-US")}
                {choice.kind === "perM2" ? "/م²" : ""}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}