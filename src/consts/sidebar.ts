import {
  Home,
  Inbox,
  Calendar,
  Search,
  Settings,
  User,
  Boxes,
  Warehouse,
  HelpCircle,
  Truck,
  Factory,
  PackageSearch,
  PencilRuler,
  Users,
  CircleDollarSign,
  NotepadText,
} from "lucide-react";
import { ROLES, Role } from "./role";

export interface SidebarItem {
  title: string;
  url: string;
  icon: any;
  roles?: Role[];
  isLocked?: boolean | false;
}

export interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}

export const SIDEBAR_CONFIG: SidebarGroup[] = [
  {
    label: "Application",
    items: [
      { title: "Dashboard", url: "/", icon: Home },
      { title: "Products", url: "/products", icon: Inbox },
      { title: "Calendar", url: "/calendar", icon: Calendar },
      { title: "Search", url: "/search", icon: Search },
    ],
  },
  {
    label: "Management",
    items: [
      {
        title: "Users",
        url: "/users",
        icon: User,
        roles: [ROLES.ADMIN], // ⛔ ADMIN ONLY
      },
    ],
  },
  {
    label: "Inventory",
    items: [
      {
        title: "Supplier",
        url: "/supplier",
        icon: Truck,
        roles: [ROLES.ADMIN , ROLES.STOCK_CONTROLLER],
      },
      {
        title: "Raw Materials",
        url: "/raw-materials",
        icon: Factory,
        roles: [ROLES.ADMIN , ROLES.STOCK_CONTROLLER],
        isLocked: true,
      },
      {
        title: "Production",
        url: "/production",
        icon: PackageSearch,
        roles: [ROLES.ADMIN , ROLES.STOCK_CONTROLLER],
        isLocked: true,
      },
    ],
  },
  {
    label: "Catalogs",
    items: [
      {
        title: "Muti Warehouses",
        url: "/warehouses",
        icon: Warehouse,
        roles: [ROLES.ADMIN , ROLES.STOCK_CONTROLLER],
      },
      {
        title: "Categories",
        url: "/categories",
        icon: Boxes,
        roles: [ROLES.ADMIN , ROLES.STOCK_CONTROLLER],
      },
      {
        title: "Unit of Measurement",
        url: "/unit-of-measurement",
        icon: PencilRuler,
        roles: [ROLES.ADMIN , ROLES.STOCK_CONTROLLER],
        isLocked: true,
      },
    ],
  },
  {
    label: "Sale Management & POS",
    items: [
      {
        title: "Customer",
        url: "/customer",
        icon: Users,
        roles: [ROLES.ADMIN , ROLES.VENDER],
        isLocked: true,
      },
      {
        title: "Sale Orders",
        url: "/sale-orders",
        icon: CircleDollarSign,
        roles: [ROLES.ADMIN , ROLES.VENDER],
        isLocked: true,
      },
    ],
  },
    {
    label: "Report & Analytics",
    items: [
      {
        title: "Financial Report",
        url: "/financial-report",
        icon: NotepadText,
        roles: [ROLES.ADMIN , ROLES.VENDER],
        isLocked: true,
      },
    ],
  },
  {
    label: "Settings",
    items: [
      { 
        title: "Settings", 
        url: "/settings", 
        icon: Settings , 
        roles: [ROLES.ADMIN] , 
        isLocked: true,
      },
      {
        title: "Company",
        url: "/company",
        icon: User,
        roles: [ROLES.ADMIN],
        isLocked: true,
      },
    ],
  },
  {
    items: [{ title: "Help", url: "/help", icon: HelpCircle }],
  },
];
