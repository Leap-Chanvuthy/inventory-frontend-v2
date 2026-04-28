import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TopTab } from "../types";

interface TopTabsProps {
  activeTopTab: TopTab;
  onChange: (tab: TopTab) => void;
  onCreateOrder: () => void;
}

export function TopTabs({ activeTopTab, onChange, onCreateOrder }: TopTabsProps) {
  return (
<div className="flex items-center justify-between gap-3">
  {/* Tabs */}
  <div className="flex items-center gap-5 border-b border-border">
    {(["ACTIVE", "HISTORY"] as TopTab[]).map(tab => {
      const isActive = activeTopTab === tab;

      return (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`relative h-9 pb-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
            isActive
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab}
          <span
            className={`absolute inset-x-0 bottom-[-1px] h-0.5 rounded-full transition-all ${
              isActive ? "bg-primary" : "scale-x-0 bg-transparent"
            }`}
          />
        </button>
      );
    })}
  </div>

  {/* Create Button */}
  <Button size="sm" onClick={onCreateOrder} className="h-8 px-3 text-xs">
    <CirclePlus className="mr-1 h-3.5 w-3.5" />
    Create Order
  </Button>
</div>
  );
}
