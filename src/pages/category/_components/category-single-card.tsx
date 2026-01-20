import { Edit2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "@/utils/date-format";

interface Category {
  id: number;
  category_name: string;
  label_color: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface SingleCardProps {
  category: Category;
  onDelete?: (id: number) => void;
  viewRoute?: string;
  editRoute?: string;
}

const SingleCard = ({
  category,
  viewRoute = "/categories/view",
  editRoute = "/categories/edit",
}: SingleCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
      <Link to={`${viewRoute}/${category.id}`} className="block cursor-pointer">
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
      </Link>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-xs sm:text-sm text-muted-foreground">
          Created: {formatDate(category.created_at)}
        </span>

        <div className="flex items-center gap-3">
          <Link
            to={`${editRoute}/${category.id}`}
            className="flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </Link>

          {/* <button
            onClick={() => onDelete?.(category.id)}
            className="flex items-center gap-1 text-sm text-destructive hover:text-destructive/80 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default SingleCard;
