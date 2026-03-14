import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type CategoryDialogMode = "create" | "update";

export type CategoryDialogValues = {
  category_name: string;
  description: string;
  label_color: string;
};

interface CategoryCreateUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: CategoryDialogMode;
  defaultValues?: Partial<CategoryDialogValues>;
  isSubmitting?: boolean;
  onSubmit: (values: CategoryDialogValues) => Promise<void>;
}

export function CategoryCreateUpdateDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
  isSubmitting = false,
  onSubmit,
}: CategoryCreateUpdateDialogProps) {
  const [values, setValues] = useState<CategoryDialogValues>({
    category_name: "",
    description: "",
    label_color: "#5c52d6",
  });

  useEffect(() => {
    if (!open) return;
    setValues({
      category_name: defaultValues?.category_name || "",
      description: defaultValues?.description || "",
      label_color: defaultValues?.label_color || "#5c52d6",
    });
  }, [open, defaultValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.category_name.trim()) return;

    await onSubmit({
      category_name: values.category_name.trim(),
      description: values.description.trim(),
      label_color: values.label_color,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Category" : "Update Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="category_name">Category Name</Label>
            <Input
              id="category_name"
              value={values.category_name}
              onChange={e =>
                setValues(prev => ({ ...prev, category_name: e.target.value }))
              }
              placeholder="e.g. Raw Ingredients"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={values.description}
              onChange={e =>
                setValues(prev => ({ ...prev, description: e.target.value }))
              }
              placeholder="Optional description"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="label_color">Label Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="label_color"
                type="color"
                className="w-14 h-9 p-1"
                value={values.label_color}
                onChange={e =>
                  setValues(prev => ({ ...prev, label_color: e.target.value }))
                }
              />
              <Input
                value={values.label_color}
                onChange={e =>
                  setValues(prev => ({ ...prev, label_color: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !values.category_name.trim()}>
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                  ? "Create"
                  : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
