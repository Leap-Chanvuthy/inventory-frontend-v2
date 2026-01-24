import { Badge } from "@/components/ui/badge";

interface UOMStatusBadgeProps {
  isActive: number;
}

export function UOMStatusBadge({ isActive }: UOMStatusBadgeProps) {
  return isActive ? (
    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
      Active
    </Badge>
  ) : (
    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
      Inactive
    </Badge>
  );
}
