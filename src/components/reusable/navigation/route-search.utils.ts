import { SidebarGroup, SidebarItem } from "@/consts/sidebar";

export function getAvailableRoutesByRole(
  groups: SidebarGroup[],
  canAny: (permissionList: string[]) => boolean
): SidebarItem[] {
  return groups
    .flatMap(group => group.items)
    .filter(item => {
      if (!item.permissions || item.permissions.length === 0) return true;
      return canAny(item.permissions);
    })
    .filter(item => !item.isLocked);
}
