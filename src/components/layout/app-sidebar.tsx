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
  const { role } = useAuth();

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="flex items-center justify-center h-[72px] px-5 border-b">
        {/* <img
          src="https://cdn2.vectorstock.com/i/1000x1000/75/61/software-as-a-service-saas-technology-icon-logo-vector-34097561.jpg"
          className="h-8 w-8 rounded-md"
        /> */}
        <h1 className="text-lg font-semibold">Inventory</h1>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {SIDEBAR_CONFIG.map((group, idx) => {
          const filteredItems = group.items.filter(
            item => !item.roles || item.roles.includes(role as any)
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
