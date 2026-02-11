import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from "lucide-react";
import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface HeaderActionButtonsProps {
  editPath?: string;
  onEdit?: () => void;
  showEdit?: boolean;
  editLabel?: string;
  onDelete?: () => void;
  showDelete?: boolean;
  deleteLabel?: string;
  deleteHeading?: string;
  deleteSubheading?: string;
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
  customButtonsPosition?: "before" | "after" | "between";
  customUI?: ReactNode;
}

export const HeaderActionButtons = ({
  editPath,
  onEdit,
  showEdit = true,
  editLabel = "Edit",
  onDelete,
  showDelete = true,
  deleteLabel = "Delete",
  deleteHeading,
  deleteSubheading,
  className = "",
  disabled = false,
  children,
  customButtonsPosition = "after",
  customUI
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
      <SquarePen className="h-4 w-4" />
      <span className="hidden sm:inline">{editLabel}</span>
    </Button>
  );

  // Use Dialog confirmation if heading and subheading are provided, otherwise use Button
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete();
      setDeleteDialogOpen(false);
    }
  };

  const deleteButton = showDelete && onDelete && (
    deleteHeading && deleteSubheading ? (
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2 sm:size-default"
            disabled={disabled}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">{deleteLabel}</span>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-lg"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{deleteHeading}</DialogTitle>
            <DialogDescription>{deleteSubheading}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ) : (
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
    )
  );

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {customUI}
      {customButtonsPosition === "before" && children}
      {editButton}
      {customButtonsPosition === "between" && children}
      {deleteButton}
      {customButtonsPosition === "after" && children}
    </div>
  );
};
