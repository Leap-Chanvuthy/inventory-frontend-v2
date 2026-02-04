import { Link } from "react-router-dom";
import { formatDate } from "@/utils/date-format";
import TableActions from "@/components/reusable/partials/table-actions";
import { Text } from "@/components/ui/text/app-text";

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
  viewRoute: string;
  editRoute: string;
  hideActions?: boolean;
  disableLink?: boolean;
  interactive?: boolean;
  variant?: "default" | "compact";
}

const SingleCard = ({
  category,
  viewRoute,
  editRoute,
  onDelete,
  hideActions = false,
  disableLink = false,
  interactive = true,
  variant = "default",
}: SingleCardProps) => {
  const isCompact = variant === "compact";

  return (
    <div
      className={
        interactive
          ? `bg-card border border-border rounded-lg ${isCompact ? "p-4" : "p-6"} hover:shadow-lg transition-shadow duration-300`
          : `bg-card border border-border rounded-lg ${isCompact ? "p-4" : "p-6"}`
      }
    >
      {disableLink ? (
        <div className="block">
          <div className={`flex justify-center ${isCompact ? "mb-4" : "mb-6"}`}>
            <div
              className={
                isCompact
                  ? "w-20 h-20 sm:w-24 sm:h-24 rounded-full"
                  : "w-32 h-32 sm:w-40 sm:h-40 rounded-full"
              }
              style={{ backgroundColor: category.label_color }}
            />
          </div>

          <Text.TitleSmall className="text-primary mb-2">
            {category.category_name}
          </Text.TitleSmall>

          <p
            className={
              isCompact
                ? "text-foreground font-bold text-base mb-4 line-clamp-3 min-h-[3rem]"
                : "text-foreground font-bold text-lg sm:text-xl mb-6 line-clamp-2 min-h-[3.5rem]"
            }
          >
            {category.description}
          </p>
        </div>
      ) : (
        <Link to={`${viewRoute}/${category.id}`} className="block cursor-pointer">
          <div className={`flex justify-center ${isCompact ? "mb-4" : "mb-6"}`}>
            <div
              className={
                isCompact
                  ? "w-20 h-20 sm:w-24 sm:h-24 rounded-full"
                  : "w-32 h-32 sm:w-40 sm:h-40 rounded-full"
              }
              style={{ backgroundColor: category.label_color }}
            />
          </div>

          <Text.TitleSmall className="text-primary mb-2">
            {category.category_name}
          </Text.TitleSmall>

          <p
            className={
              isCompact
                ? "text-foreground font-bold text-base mb-4 line-clamp-3 min-h-[3rem]"
                : "text-foreground font-bold text-lg sm:text-xl mb-6 line-clamp-2 min-h-[3.5rem]"
            }
          >
            {category.description}
          </p>
        </Link>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-xs sm:text-sm text-muted-foreground">
          Created: {formatDate(category.created_at)}
        </span>

        {!hideActions && (
          <div className="flex items-center gap-3">
            <TableActions
              viewDetailPath={`${viewRoute}/${category.id}`}
              editPath={`${editRoute}/${category.id}`}
              deleteHeading="Delete This Category"
              deleteSubheading="Are you sure want to delete this category? This action cannot be undone."
              deleteTooltip="Delete Category"
              onDelete={() => onDelete?.(category.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleCard;
