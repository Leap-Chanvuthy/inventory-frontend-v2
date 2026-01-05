import { Edit2, Trash2 } from "lucide-react";
import { RawMaterialCategory } from "@/api/categories/category.types";

interface CategoryCardProps {
  data?: RawMaterialCategory[];
  isLoading?: boolean;
  emptyText?: string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const SingleCard = ({
  category,
  onEdit,
  onDelete,
}: {
  category: RawMaterialCategory;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
      {/* Color Circle */}
      <div className="flex justify-center mb-6">
        <div
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-full"
          style={{ backgroundColor: category.label_color }}
        />
      </div>

      {/* Category Name Label */}
      <h3 className="text-primary font-semibold text-base sm:text-lg mb-2">
        {category.category_name}
      </h3>

      {/* Category Name Value */}
      <p className="text-foreground font-bold text-lg sm:text-xl mb-6 line-clamp-2 min-h-[3.5rem]">
        {category.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-xs sm:text-sm text-muted-foreground">
          Created: {formatDate(category.created_at)}
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit?.(category.id)}
            className="flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => onDelete?.(category.id)}
            className="flex items-center gap-1 text-sm text-destructive hover:text-destructive/80 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const CategoryCard = ({
  data = [],
  isLoading = false,
  emptyText = "No categories found",
  onEdit,
  onDelete,
}: CategoryCardProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading categories...</p>
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
      {data.map((category) => (
        <SingleCard
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
