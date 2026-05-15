import { useState } from "react";
import { CalendarDays, ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Preset = {
  label: string;
  start: () => string;
  end: () => string;
};

const ymd = (d: Date) => d.toISOString().slice(0, 10);
const today = () => ymd(new Date());

const PRESETS: Preset[] = [
  {
    label: "All",
    start: () => "",
    end: () => "",
  },
  {
    label: "This Year",
    start: () => `${new Date().getFullYear()}-01-01`,
    end: () => `${new Date().getFullYear()}-12-31`,
  },
  {
    label: "This Month",
    start: () => {
      const d = new Date();
      return ymd(new Date(d.getFullYear(), d.getMonth(), 1));
    },
    end: () => {
      const d = new Date();
      return ymd(new Date(d.getFullYear(), d.getMonth() + 1, 0));
    },
  },
  {
    label: "Last 3 Months",
    start: () => {
      const d = new Date();
      d.setMonth(d.getMonth() - 3);
      return ymd(d);
    },
    end: today,
  },
  {
    label: "Last 6 Months",
    start: () => {
      const d = new Date();
      d.setMonth(d.getMonth() - 6);
      return ymd(d);
    },
    end: today,
  },
  {
    label: "Last Year",
    start: () => `${new Date().getFullYear() - 1}-01-01`,
    end: () => `${new Date().getFullYear() - 1}-12-31`,
  },
];

interface Props {
  onApply: (start: string, end: string) => void;
  isFetching: boolean;
  onRefresh: () => void;
}

export function DashboardDateFilter({ onApply, isFetching, onRefresh }: Props) {
  const [activePreset, setActivePreset] = useState("This Year");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const handlePreset = (preset: Preset) => {
    setActivePreset(preset.label);
    setShowCustom(false);
    onApply(preset.start(), preset.end());
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      setActivePreset("Custom");
      onApply(customStart, customEnd);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Preset dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-2 min-w-[140px] justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm">{activePreset}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {PRESETS.map(p => (
            <DropdownMenuItem
              key={p.label}
              onClick={() => handlePreset(p)}
              className={activePreset === p.label && !showCustom ? "bg-primary/10 text-primary font-medium" : ""}
            >
              {p.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setShowCustom(true);
              setActivePreset("Custom");
            }}
            className={showCustom ? "bg-primary/10 text-primary font-medium" : ""}
          >
            Custom Range
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Custom date inputs */}
      {showCustom && (
        <>
          <Input
            type="date"
            value={customStart}
            onChange={e => setCustomStart(e.target.value)}
            className="h-9 text-sm w-[130px]"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <Input
            type="date"
            value={customEnd}
            onChange={e => setCustomEnd(e.target.value)}
            className="h-9 text-sm w-[130px]"
          />
          <Button
            size="sm"
            className="h-9"
            onClick={handleCustomApply}
            disabled={!customStart || !customEnd || isFetching}
          >
            Apply
          </Button>
        </>
      )}

      {/* Refresh */}
      <Button
        size="sm"
        variant="outline"
        className="h-9 w-9 p-0"
        onClick={onRefresh}
        disabled={isFetching}
        title="Refresh"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
      </Button>
    </div>
  );
}
