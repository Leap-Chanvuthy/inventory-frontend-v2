import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { SIDEBAR_CONFIG } from "../../consts/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { SidebarMenuGroup } from "./sidebar-menu";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/auth-slice";

export function AppSidebar() {
  const { user, role } = useAuth();
  const dispatch = useDispatch();

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          {/* <img
            src="https://cdn2.vectorstock.com/i/1000x1000/75/61/software-as-a-service-saas-technology-icon-logo-vector-34097561.jpg"
            className="h-8 w-8 rounded-md"
          /> */}
          <h1 className="text-lg font-semibold">Inventory</h1>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {SIDEBAR_CONFIG.map((group, idx) => {
          const filteredItems = group.items.filter(
            (item) =>
              !item.roles || item.roles.includes(role as any)
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              {/* <User size={14} /> */}
              <img src={user?.profile_picture || ''} alt={user?.name} className="h-8 w-8 rounded-full" />
            </div>
            <div className="text-xs">
              <div className="font-medium">{user?.name}</div>
              <div className="text-muted-foreground">{user?.role}</div>
            </div>
          </div>

          <button
            onClick={() => dispatch(logout())}
            className="text-destructive hover:opacity-80"
          >
            <LogOut size={16} />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
