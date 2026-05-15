import { SIDEBAR_CONFIG } from "@/consts/sidebar";

const FALLBACK_ROUTE = "/profile";

export function getFirstAccessibleRoute(permissions: string[] = []): string {
  const permissionSet = new Set(permissions || []);

  const first = SIDEBAR_CONFIG
    .flatMap(group => group.items)
    .find(item => {
      if (item.isLocked) {
        return false;
      }

      if (!item.permissions || item.permissions.length === 0) {
        return true;
      }

      return item.permissions.some(permission => permissionSet.has(permission));
    });

  return first?.url || FALLBACK_ROUTE;
}

