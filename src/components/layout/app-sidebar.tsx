import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SIDEBAR_CONFIG } from "../../consts/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { SidebarMenuGroup } from "./sidebar-menu";
import SidebarFooterComponent from "./sidebar-footer";

export function AppSidebar() {
  const { canAny } = useAuth();

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="flex items-center justify-center h-[72px] px-5 border-b">
        <div className="rounded-md bg-white px-3 py-1.5">
          <img
            src="/assets/logo/camsme-logo-default.svg"
            alt="CAMSME"
            className="h-8 w-auto"
          />
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {SIDEBAR_CONFIG.map((group, idx) => {
          const filteredItems = group.items.filter(
            item =>
              !item.permissions ||
              item.permissions.length === 0 ||
              canAny(item.permissions)
          );

          if (filteredItems.length === 0) return null;

          return (
            <SidebarMenuGroup
              key={idx}
              group={{ ...group, items: filteredItems }}
            />
          );
        })}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t p-4">
        <SidebarFooterComponent />
      </SidebarFooter>
    </Sidebar>
  );
}
