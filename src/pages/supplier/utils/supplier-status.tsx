import { Badge } from "@/components/ui/badge";

interface SupplierCategoryBadgeProps {
  category: string;
}

export const SupplierCategoryBadge = ({
  category,
}: SupplierCategoryBadgeProps) => {
  const map: Record<string, string> = {
    ELECTRONICS: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    PRODUCTS: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    FOOD: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    CLOTHING: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    LOGISTICS: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    OTHERS: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  };

  return (
    <Badge variant="secondary" className={map[category] || map["OTHERS"]}>
      {category}
    </Badge>
  );
};
