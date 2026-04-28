import {
  CheckCircle2,
  Clock,
  FileText,
  PauseCircle,
  RotateCcw,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { OrderStatus } from "./types";

export const RIEL_RATE = 4100;

export interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  icon: LucideIcon;
}

export const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  DRAFT: {
    label: "Draft",
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
    icon: FileText,
  },
  PROCESSING: {
    label: "Processing",
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    border: "border-blue-500/20",
    icon: Clock,
  },
  ON_HOLD: {
    label: "On Hold",
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    border: "border-amber-500/20",
    icon: PauseCircle,
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-green-500/10",
    text: "text-green-600",
    border: "border-green-500/20",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-red-500/10",
    text: "text-red-600",
    border: "border-red-500/20",
    icon: XCircle,
  },
  REFUNDED: {
    label: "Refunded",
    bg: "bg-orange-500/10",
    text: "text-orange-600",
    border: "border-orange-500/20",
    icon: RotateCcw,
  },
};

export const ACTIVE_SUB_TABS: OrderStatus[] = ["DRAFT", "PROCESSING", "ON_HOLD"];
export const HISTORY_SUB_TABS: OrderStatus[] = ["COMPLETED", "CANCELLED", "REFUNDED"];
