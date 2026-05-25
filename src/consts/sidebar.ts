import {
  Activity,
  CircleDollarSign,
  Home,
  NotepadText,
  PackageSearch,
  PencilRuler,
  ShieldCheck,
  Tag,
  Truck,
  type LucideIcon,
  User,
  Users,
  Warehouse,
} from "lucide-react";

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
  permissions?: string[];
  isLocked?: boolean;
  isQuickMenu?: boolean;
}

export interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}

export const SIDEBAR_CONFIG: SidebarGroup[] = [
  {
    label: "Application & Management",
    items: [
      { title: "Dashboard", url: "/", icon: Home, permissions: ["dashboard.read"] },
      {
        title: "Users",
        url: "/users",
        icon: User,
        permissions: ["users.read_all", "users.create", "users.update_all"],
        isQuickMenu: true,
      },
      {
        title: "Audit Logs",
        url: "/audit-logs",
        icon: Activity,
        permissions: ["audit_logs.read"],
        isQuickMenu: true,
      },
      {
        title: "Roles & Permissions",
        url: "/roles",
        icon: ShieldCheck,
        permissions: [
          "roles.read_all",
          "roles.create",
          "roles.update",
          "roles.assign_permissions",
        ],
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
        permissions: ["suppliers.read_all", "suppliers.read_own"],
        isQuickMenu: true,
      },
      {
        title: "Raw Materials",
        url: "/raw-materials",
        icon: Tag,
        permissions: ["raw_materials.read_all", "raw_materials.read_own"],
        isLocked: false,
        isQuickMenu: true,
      },
      {
        title: "Products",
        url: "/products",
        icon: PackageSearch,
        permissions: ["products.read_all", "products.read_own"],
        isLocked: false,
        isQuickMenu: true,
      },
    ],
  },
  {
    label: "Catalogs",
    items: [
      {
        title: "Multi Warehouses",
        url: "/warehouses",
        icon: Warehouse,
        permissions: ["warehouses.read_all"],
        isQuickMenu: true,
      },
      {
        title: "Unit of Measurement",
        url: "/unit-of-measurement",
        icon: PencilRuler,
        permissions: ["uom.read_all", "uom.read_own"],
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
        permissions: ["customers.read_all", "customers.read_own"],
        isLocked: false,
        isQuickMenu: true,
      },
      {
        title: "Sale Orders",
        url: "/sale-orders",
        icon: CircleDollarSign,
        permissions: ["sale_orders.read_all", "sale_orders.read_own"],
        isLocked: false,
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
        permissions: ["sale_orders.read_sale_dashboard", "dashboard.read"],
        isLocked: true,
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        title: "Company",
        url: "/company",
        icon: User,
        permissions: ["company.read", "company.update", "company.create"],
        isLocked: false,
        isQuickMenu: true,
      },
      {
        title: "Profile",
        url: "/profile",
        icon: User,
        permissions: [],
      },
    ],
  },
];

export const quickMenu: SidebarItem[] = SIDEBAR_CONFIG.flatMap(group =>
  group.items.filter(item => item.isQuickMenu),
);
