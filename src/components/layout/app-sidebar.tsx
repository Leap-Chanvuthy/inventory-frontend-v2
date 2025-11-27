import { Calendar, Home, Inbox, LogOut, Search, Settings, User, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton, 
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Grouped menu arrays
const applicationMenu = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Products", url: "/products", icon: Inbox },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Search", url: "/search", icon: Search },
];

const settingMenu = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Profile", url: "/profile", icon: User },
];



// Single menu items (no group)
const singleMenu = [
  { title: "Help", url: "/help", icon: HelpCircle },
    { title: "Company Info", url: "/company-info", icon: User },
];

export function AppSidebar() {
  const location = useLocation();

  const renderMenuGroup = (title: string, items: typeof applicationMenu) => (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              location.pathname === item.url ||
              location.pathname.startsWith(item.url + "/");

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    to={item.url}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                      "hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]",
                      isActive
                        ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm"
                        : "text-[hsl(var(--muted-foreground))]"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  const renderSingleMenu = (items: typeof singleMenu) => (
    <SidebarMenu className="mt-2">
      {items.map((item) => {
        const isActive =
          location.pathname === item.url ||
          location.pathname.startsWith(item.url + "/");

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link
                to={item.url}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  "hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]",
                  isActive
                    ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm"
                    : "text-[hsl(var(--muted-foreground))]"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );

  return (
    <Sidebar>
      {/* Sidebar Header */}
      <SidebarHeader className="p-4 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-2">
          <img
            src="https://cdn2.vectorstock.com/i/1000x1000/75/61/software-as-a-service-saas-technology-icon-logo-vector-34097561.jpg"
            alt="App Logo"
            className="h-8 w-8 rounded-md bg-[hsl(var(--primary))]"
          />
          <h1 className="text-lg font-semibold text-[hsl(var(--sidebar-foreground))]">
            Inventory
          </h1>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        {renderMenuGroup("Application", applicationMenu)}
        {renderMenuGroup("Settings", settingMenu)}
        {renderSingleMenu(singleMenu)}
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t border-[hsl(var(--sidebar-border))] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-[hsl(var(--primary-foreground))] font-semibold">
              <User size={16} />
            </div>
            <div className="flex flex-col text-xs">
              <span className="font-medium text-[hsl(var(--sidebar-foreground))]">
                Leap Chanvuthy
              </span>
              <span className="text-[hsl(var(--muted-foreground))] text-[10px]">
                Admin
              </span>
            </div>
          </div>

          <button
            className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] transition"
            title="Logout"
          >
            <LogOut size={16} color="red" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
