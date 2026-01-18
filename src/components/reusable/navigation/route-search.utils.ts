import { SidebarGroup, SidebarItem } from "@/consts/sidebar";
import { Role } from "@/consts/role";

export function getAvailableRoutesByRole(
  groups: SidebarGroup[],
  role: Role | string | null
): SidebarItem[] {
  return groups
    .flatMap(group => group.items)
    .filter(item => {
      if (!item.roles) return true;
      if (!role) return false;

      return item.roles.includes(role as Role);
    })
    .filter(item => !item.isLocked);
}