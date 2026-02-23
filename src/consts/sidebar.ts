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
  PackageSearch,
  PencilRuler,
  Users,
  CircleDollarSign,
  NotepadText,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { ROLES, Role } from "./role";

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
  roles?: Role[];
  isLocked?: boolean | false;
  isQuickMenu?: boolean | false;
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
        isQuickMenu: true,
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
        roles: [ROLES.ADMIN, ROLES.STOCK_CONTROLLER],
        isQuickMenu: true,
      },
      {
        title: "Raw Materials",
        url: "/raw-materials",
        icon: Tag,
        roles: [ROLES.ADMIN, ROLES.STOCK_CONTROLLER],
        isLocked: false,
        isQuickMenu: true,
      },
      {
        title: "Products",
        url: "/products",
        icon: PackageSearch,
        roles: [ROLES.ADMIN, ROLES.STOCK_CONTROLLER],
        isLocked: true,
        isQuickMenu: true,
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
        roles: [ROLES.ADMIN, ROLES.STOCK_CONTROLLER],
        isQuickMenu: true,
      },
      {
        title: "Categories",
        url: "/categories",
        icon: Boxes,
        roles: [ROLES.ADMIN, ROLES.STOCK_CONTROLLER],
        isQuickMenu: true,
      },
      {
        title: "Unit of Measurement",
        url: "/unit-of-measurement",
        icon: PencilRuler,
        roles: [ROLES.ADMIN, ROLES.STOCK_CONTROLLER],
        isQuickMenu: true,
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
        roles: [ROLES.ADMIN, ROLES.VENDER],
        isLocked: false,
      },
      {
        title: "Sale Orders",
        url: "/sale-orders",
        icon: CircleDollarSign,
        roles: [ROLES.ADMIN, ROLES.VENDER],
        isLocked: true,
        isQuickMenu: true,
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
        roles: [ROLES.ADMIN, ROLES.VENDER],
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
        icon: Settings,
        roles: [ROLES.ADMIN],
        isLocked: true,
      },
      {
        title: "Company",
        url: "/company",
        icon: User,
        roles: [ROLES.ADMIN],
        isLocked: false,
        isQuickMenu: true,
      },
      {
        title: "Profile",
        url: "/profile",
        icon: User,
        roles: [ROLES.ADMIN, ROLES.VENDER, ROLES.STOCK_CONTROLLER],
      },
    ],
  },
  {
    items: [{ title: "Help", url: "/help", icon: HelpCircle }],
  },
];

export const quickMenu: SidebarItem[] = SIDEBAR_CONFIG.flatMap((group) =>
  group.items.filter((item) => item.isQuickMenu),
);
