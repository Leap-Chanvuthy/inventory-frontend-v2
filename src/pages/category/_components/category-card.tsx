import SingleCard from "./category-single-card";
import DataTableLoading from "@/components/reusable/data-table/data-table-loading";

interface Category {
  id: number;
  category_name: string;
  label_color: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface CategoryCardProps {
  data?: Category[];
  isLoading?: boolean;
  emptyText?: string;
  onDelete?: (id: number | string) => void;
  viewRoute?: string;
  editRoute?: string;
}

export const CategoryCard = ({
  data = [],
  isLoading = false,
  emptyText = "No categories found",
  onDelete,
  viewRoute = "/categories/view",
  editRoute = "/categories/edit",
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
    <div className="grid grid-cols-1 md:grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 mt-12 cl:grid-cols-3  gap-5">
      {data.map(category => (
        <SingleCard
          key={category.id}
          category={category}
          onDelete={onDelete}
          viewRoute={viewRoute}
          editRoute={editRoute}
        />
      ))}
    </div>
  );
};
