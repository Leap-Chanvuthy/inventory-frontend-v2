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
} from "lucide-react";
import { ROLES, Role } from "./role";

export interface SidebarItem {
  title: string;
  url: string;
  icon: any;
  roles?: Role[];
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
        roles: [ROLES.ADMIN],
      },
    ],
  },

  {
    label: "Catalogs",
    items: [
      {
        title: "Warehouses",
        url: "/warehouses",
        icon: Warehouse,
        roles: [ROLES.ADMIN],
      },
      {
        title: "Categories",
        url: "/categories",
        icon: Boxes,
        roles: [ROLES.ADMIN],
      },
    ],
  },
  {
    label: "Settings",
    items: [
      { title: "Settings", url: "/settings", icon: Settings },
      {
        title: "Company",
        url: "/company",
        icon: User,
        roles: [ROLES.ADMIN],
      },
    ],
  },
  {
    items: [{ title: "Help", url: "/help", icon: HelpCircle }],
  },
];
