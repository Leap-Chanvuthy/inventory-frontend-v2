import { RawMaterialCategory } from "@/api/categories/category.types";
import SingleCard from "./category-single-card";
import DataTableLoading from "@/components/reusable/data-table/data-table-loading";

interface CategoryCardProps {
  data?: RawMaterialCategory[];
  isLoading?: boolean;
  emptyText?: string;
  onDelete?: (id: number) => void;
}

export const CategoryCard = ({
  data = [],
  isLoading = false,
  emptyText = "No categories found",
  onDelete,
}: CategoryCardProps) => {
  if (isLoading) {
    return (
      <div className="flex min-h-[220px] w-full items-center justify-center text-center">
        <DataTableLoading />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 mt-12 lg:grid-cols-3 gap-x-24 gap-y-14">
      {data.map(category => (
        <SingleCard key={category.id} category={category} onDelete={onDelete} />
      ))}
    </div>
  );
};
