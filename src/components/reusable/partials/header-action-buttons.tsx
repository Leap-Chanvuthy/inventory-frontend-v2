import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { ReactNode } from "react";

interface HeaderActionButtonsProps {
  editPath?: string;
  onEdit?: () => void;
  showEdit?: boolean;
  editLabel?: string;
  onDelete?: () => void;
  showDelete?: boolean;
  deleteLabel?: string;
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
  customButtonsPosition?: "before" | "after" | "between";
}

export const HeaderActionButtons = ({
  editPath,
  onEdit,
  showEdit = true,
  editLabel = "Edit",
  onDelete,
  showDelete = true,
  deleteLabel = "Delete",
  className = "",
  disabled = false,
  children,
  customButtonsPosition = "after",
}: HeaderActionButtonsProps) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    if (editPath) {
      navigate(editPath);
    } else if (onEdit) {
      onEdit();
    }
  };

  const editButton = showEdit && (
    <Button
      variant="default"
      size="sm"
      className="flex items-center gap-2 bg-primary sm:size-default"
      onClick={handleEdit}
      disabled={disabled}
    >
      <Pencil className="h-4 w-4" />
      <span className="hidden sm:inline">{editLabel}</span>
    </Button>
  );

  const deleteButton = showDelete && (
    <Button
      variant="destructive"
      size="sm"
      className="flex items-center gap-2 sm:size-default"
      onClick={onDelete}
      disabled={disabled}
    >
      <Trash2 className="h-4 w-4" />
      <span className="hidden sm:inline">{deleteLabel}</span>
    </Button>
  );

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {customButtonsPosition === "before" && children}
      {editButton}
      {customButtonsPosition === "between" && children}
      {deleteButton}
      {customButtonsPosition === "after" && children}
    </div>
  );
};
