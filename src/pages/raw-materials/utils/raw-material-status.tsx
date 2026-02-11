import { Badge } from "@/components/ui/badge";

export const CategoryBadge = ({
  category,
  color,
}: {
  category: string;
  color?: string;
}) => {
  return (
    <Badge
      variant="outline"
      className="whitespace-nowrap min-w-[140px] justify-center"
      style={{
        backgroundColor: color ? `${color}20` : undefined,
        borderColor: color || undefined,
        color: color || undefined,
      }}
    >
      {category}
    </Badge>
  );
};

export const StockStatusBadge = ({
  quantity,
  minimumStock,
}: {
  quantity: number;
  minimumStock: number;
}) => {
  let status: { label: string; className: string };

  if (quantity === 0) {
    status = {
      label: "Out of Stock",
      className:
        "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    };
  } else if (quantity <= minimumStock) {
    status = {
      label: "Low Stock",
      className:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    };
  } else {
    status = {
      label: "Available",
      className:
        "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    };
  }

  return (
    <Badge
      variant="outline"
      className={`min-w-[90px] justify-center ${status.className}`}
    >
      {status.label}
    </Badge>
  );
};
