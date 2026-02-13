import {
  Type,
  Hash,
  Calendar,
  CalendarClock,
  FileText,
  Activity,
  Package,
  Ruler,
  Barcode,
  Tag,
  Warehouse,
  User,
  TrendingUp,
  TrendingDown,
  Mail,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  DollarSign,
  Clock,
  Shield,
  Star,
  Image,
  type LucideIcon,
} from "lucide-react";

// ── Icon map: semantic label → best-matching Lucide icon ──
export type IconBadgeLabel =
  | "name"
  | "code"
  | "barcode"
  | "symbol"
  | "type"
  | "category"
  | "status"
  | "description"
  | "created_date"
  | "updated_date"
  | "expiry_date"
  | "warehouse"
  | "supplier"
  | "stock_up"
  | "stock_down"
  | "unit"
  | "email"
  | "phone"
  | "address"
  | "website"
  | "payment"
  | "price"
  | "time"
  | "role"
  | "rating"
  | "image";

const ICON_MAP: Record<IconBadgeLabel, LucideIcon> = {
  name: Type,
  code: Hash,
  barcode: Barcode,
  symbol: Ruler,
  type: Package,
  category: Tag,
  status: Activity,
  description: FileText,
  created_date: Calendar,
  updated_date: CalendarClock,
  expiry_date: Calendar,
  warehouse: Warehouse,
  supplier: User,
  stock_up: TrendingUp,
  stock_down: TrendingDown,
  unit: Ruler,
  email: Mail,
  phone: Phone,
  address: MapPin,
  website: Globe,
  payment: CreditCard,
  price: DollarSign,
  time: Clock,
  role: Shield,
  rating: Star,
  image: Image,
};

export function iconBadgeIcon(label: IconBadgeLabel): LucideIcon {
  return ICON_MAP[label];
}

// ── Color variant classes ──
export type IconBadgeVariant =
  | "default"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "indigo"
  | "purple"
  | "cyan"
  | "orange"
  | "pink"
  | "slate"
  | "rose"
  | "violet"
  | "teal";

export function iconBadgeClass(variant: IconBadgeVariant) {
  const base =
    "inline-flex h-7 w-7 items-center justify-center rounded-full ring-1";
  switch (variant) {
    case "primary":
      return `${base} bg-primary/10 text-primary ring-primary/20`;
    case "info":
      return `${base} bg-sky-500/10 text-sky-600 ring-sky-500/20 dark:text-sky-400`;
    case "success":
      return `${base} bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400`;
    case "warning":
      return `${base} bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400`;
    case "danger":
      return `${base} bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400`;
    case "indigo":
      return `${base} bg-indigo-500/10 text-indigo-600 ring-indigo-500/20 dark:text-indigo-400`;
    case "purple":
      return `${base} bg-purple-500/10 text-purple-600 ring-purple-500/20 dark:text-purple-400`;
    case "cyan":
      return `${base} bg-cyan-500/10 text-cyan-600 ring-cyan-500/20 dark:text-cyan-400`;
    case "orange":
      return `${base} bg-orange-500/10 text-orange-600 ring-orange-500/20 dark:text-orange-400`;
    case "pink":
      return `${base} bg-pink-500/10 text-pink-600 ring-pink-500/20 dark:text-pink-400`;
    case "slate":
      return `${base} bg-slate-500/10 text-slate-600 ring-slate-500/20 dark:text-slate-400`;
    case "rose":
      return `${base} bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-400`;
    case "violet":
      return `${base} bg-violet-500/10 text-violet-600 ring-violet-500/20 dark:text-violet-400`;
    case "teal":
      return `${base} bg-teal-500/10 text-teal-600 ring-teal-500/20 dark:text-teal-400`;
    default:
      return `${base} bg-muted text-muted-foreground ring-border`;
  }
}
