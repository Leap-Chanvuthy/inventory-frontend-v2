import { Button } from "@/components/ui/button";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash } from "lucide-react";
import { useState } from "react";

interface DeleteModalProps {
  heading: string;
  subheading: string;
  tooltipText?: string;
  onDelete?: () => void;
}

const DeleteModal = ({
  heading,
  subheading,
  tooltipText = "Delete",
  onDelete,
}: DeleteModalProps) => {
  const [open, setOpen] = useState(false);

  const handleConfirmDelete = () => {
    if (!onDelete) return;
    onDelete();
    setOpen(false); // close dialog after triggering delete
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <button type="button" className="inline-flex items-center">
                <Trash className="w-4 h-4 text-red-500 cursor-pointer" />
              </button>
            </DialogTrigger>
          </TooltipTrigger>

          <TooltipContent side="top">{tooltipText}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent
        className="sm:max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
          <DialogDescription>{subheading}</DialogDescription>
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
            disabled={!onDelete}
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;