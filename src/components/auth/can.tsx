import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface CanProps {
  permission?: string;
  anyOf?: string[];
  allOf?: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function Can({ permission, anyOf, allOf, fallback = null, children }: CanProps) {
  const { can, canAny, canAll } = useAuth();

  if (permission && !can(permission)) {
    return <>{fallback}</>;
  }

  if (anyOf && anyOf.length > 0 && !canAny(anyOf)) {
    return <>{fallback}</>;
  }

  if (allOf && allOf.length > 0 && !canAll(allOf)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

