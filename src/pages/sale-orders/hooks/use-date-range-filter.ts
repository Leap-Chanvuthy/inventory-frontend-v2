import { useState } from "react";
import type { DateRange } from "../types";

export function useDateRangeFilter(dateRange: DateRange, onApplyRange: (value: DateRange) => void) {
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<DateRange>(dateRange);

  const openDateModal = () => {
    setTempDateRange(dateRange);
    setIsDateModalOpen(true);
  };

  const closeDateModal = () => {
    setIsDateModalOpen(false);
  };

  const applyDateFilter = () => {
    onApplyRange(tempDateRange);
    setIsDateModalOpen(false);
  };

  const clearDateFilter = () => {
    onApplyRange({ start: "", end: "" });
    setTempDateRange({ start: "", end: "" });
  };

  return {
    isDateModalOpen,
    tempDateRange,
    setTempDateRange,
    openDateModal,
    closeDateModal,
    applyDateFilter,
    clearDateFilter,
  };
}
