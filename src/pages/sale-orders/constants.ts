import {
  CheckCircle2,
  Clock,
  FileText,
  PauseCircle,
  RotateCcw,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { Customer, Order, OrderStatus, Product } from "./types";

export const RIEL_RATE = 4100;

export const CUSTOMERS: Customer[] = [
  { id: "C1", name: "Sok Mesa", category: "VIP", discount: 15, phone: "012 345 678" },
  { id: "C2", name: "Vannak Chen", category: "Regular", discount: 0, phone: "099 888 777" },
  { id: "C3", name: "Linda Sophea", category: "Gold", discount: 10, phone: "015 222 333" },
  { id: "C4", name: "Channary Keo", category: "VIP", discount: 15, phone: "011 444 555" },
  { id: "C5", name: "Rithy Ouk", category: "Regular", discount: 0, phone: "010 123 987" },
  { id: "C6", name: "Sopheap Nguon", category: "Gold", discount: 10, phone: "017 666 444" },
  { id: "C7", name: "Dara Phin", category: "Regular", discount: 0, phone: "088 999 111" },
  { id: "C8", name: "Sreymom Chea", category: "VIP", discount: 15, phone: "093 333 222" },
];

export const PRODUCTS: Product[] = [
  { id: "P1", name: "Premium Coffee Beans 1kg", price: 25.0 },
  { id: "P2", name: "Milk Frother Pro", price: 45.0 },
  { id: "P3", name: "Espresso Machine X1", price: 450.0 },
  { id: "P4", name: "Ceramic Mug Set", price: 15.0 },
  { id: "P5", name: "Teaspoon Gold Edition", price: 5.0 },
  { id: "P6", name: "Pastry Display Case", price: 890.0 },
  { id: "P7", name: "Matcha Powder 500g", price: 30.0 },
  { id: "P8", name: "Caramel Syrup 1L", price: 12.0 },
  { id: "P9", name: "Vanilla Bean Paste", price: 22.0 },
  { id: "P10", name: "Croissant (Box of 6)", price: 18.0 },
];

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
    bg: "bg-purple-500/10",
    text: "text-purple-600",
    border: "border-purple-500/20",
    icon: RotateCcw,
  },
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-8829",
    customerId: "C1",
    status: "DRAFT",
    discount: 0,
    tax: 10,
    note: "Rush order for cafe opening",
    useCategoryDiscount: true,
    items: [{ productId: "P1", qty: 2, priceAtSale: 25.0 }],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "ORD-8822",
    customerId: "C2",
    status: "PROCESSING",
    discount: 0,
    tax: 10,
    note: "Needs installation service",
    useCategoryDiscount: true,
    items: [{ productId: "P3", qty: 1, priceAtSale: 450.0 }],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "ORD-8815",
    customerId: "C3",
    status: "ON_HOLD",
    discount: 0,
    tax: 10,
    note: "Waiting for display case restock",
    useCategoryDiscount: true,
    items: [
      { productId: "P6", qty: 1, priceAtSale: 890.0 },
      { productId: "P10", qty: 10, priceAtSale: 18.0 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "ORD-8801",
    customerId: "C7",
    status: "COMPLETED",
    discount: 0,
    tax: 10,
    note: "Standard delivery",
    useCategoryDiscount: true,
    items: [
      { productId: "P1", qty: 5, priceAtSale: 25.0 },
      { productId: "P4", qty: 2, priceAtSale: 15.0 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "ORD-8799",
    customerId: "C2",
    status: "CANCELLED",
    discount: 0,
    tax: 10,
    note: "Customer found cheaper alternative",
    useCategoryDiscount: false,
    items: [{ productId: "P3", qty: 1, priceAtSale: 450.0 }],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "ORD-8780",
    customerId: "C6",
    status: "REFUNDED",
    discount: 0,
    tax: 10,
    note: "Items arrived damaged during transit",
    useCategoryDiscount: true,
    items: [
      { productId: "P9", qty: 2, priceAtSale: 22.0 },
      { productId: "P5", qty: 10, priceAtSale: 5.0 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
];

export const ACTIVE_SUB_TABS: OrderStatus[] = ["DRAFT", "PROCESSING", "ON_HOLD"];
export const HISTORY_SUB_TABS: OrderStatus[] = ["COMPLETED", "CANCELLED", "REFUNDED"];
