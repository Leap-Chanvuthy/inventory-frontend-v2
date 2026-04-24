import { CalendarDays } from "lucide-react";
import { DatePickerInput } from "@/components/reusable/partials/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DateRange } from "../types";

interface DateRangeFilterModalProps {
  open: boolean;
  value: DateRange;
  onChange: (value: DateRange) => void;
  onApply: () => void;
  onCancel: () => void;
}

export function DateRangeFilterModal({
  open,
  value,
  onChange,
  onApply,
  onCancel,
}: DateRangeFilterModalProps) {
  return (
    <Dialog open={open} onOpenChange={nextOpen => (!nextOpen ? onCancel() : undefined)}>
      <DialogContent className="max-w-sm gap-0 p-0">
        <DialogHeader className="border-b border-border px-4 py-3">
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="h-4 w-4 text-primary" />
            Filter by Date Range
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 bg-card px-4 py-3">
          <DatePickerInput
            id="sale-order-start-date"
            label="Start Date"
            value={value.start}
            onChange={nextValue => onChange({ ...value, start: nextValue })}
            placeholder="Pick start date"
            buttonClassName="h-9 bg-muted/40"
          />

          <DatePickerInput
            id="sale-order-end-date"
            label="End Date"
            value={value.end}
            onChange={nextValue => onChange({ ...value, end: nextValue })}
            placeholder="Pick end date"
            buttonClassName="h-9 bg-muted/40"
          />
        </div>

        <DialogFooter className="border-t border-border bg-muted/30 px-4 py-3">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={onApply}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
