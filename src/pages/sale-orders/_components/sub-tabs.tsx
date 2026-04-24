import type { OrderStatus } from "../types";

interface SubTabsProps {
  tabs: OrderStatus[];
  activeSubTab: OrderStatus;
  onChange: (tab: OrderStatus) => void;
}

export function SubTabs({ tabs, activeSubTab, onChange }: SubTabsProps) {
  const hasProcessingTab = tabs.includes("PROCESSING");

  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
      {tabs.map(tab => {
        const isActive = activeSubTab === tab;
        const isProcessing = tab === "PROCESSING";

        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`whitespace-nowrap rounded-md border px-3 text-[10px] font-semibold uppercase tracking-wide transition-all duration-200 ${
              hasProcessingTab ? (isProcessing ? "h-10 flex-[1.35]" : "h-9 flex-1") : "h-9 flex-1"
            } ${
              isActive
                ? "border-primary/30 bg-primary/10 text-primary shadow-sm"
                : "border-border bg-background text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            } ${isProcessing ? "text-[11px]" : ""}`}
          >
            {tab.replace(/_/g, " ")}
          </button>
        );
      })}
    </div>
  );
}
