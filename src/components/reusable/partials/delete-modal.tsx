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
  return (
    <Dialog>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onDelete?.();
        }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center"
                >
                  <Trash className="w-4 h-4 text-red-500 cursor-pointer" />
                </button>
              </DialogTrigger>
            </TooltipTrigger>

            <TooltipContent side="top">
              {tooltipText}
            </TooltipContent>
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

            <Button type="submit" variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default DeleteModal;
