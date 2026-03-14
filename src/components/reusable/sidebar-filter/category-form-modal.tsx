import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type CategoryFormMode = "create" | "edit";

export type CategoryFormData = {
  category_name: string;
  description: string;
  label_color: string;
};

interface CategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: CategoryFormMode;
  initialData?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function CategoryFormModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isSubmitting = false,
}: CategoryFormModalProps) {
  const [form, setForm] = useState<CategoryFormData>({
    category_name: "",
    description: "",
    label_color: "#5c52d6",
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      category_name: initialData?.category_name || "",
      description: initialData?.description || "",
      label_color: initialData?.label_color || "#5c52d6",
    });
  }, [open, initialData]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category_name.trim()) return;
    await onSubmit({
      category_name: form.category_name.trim(),
      description: form.description?.trim() || "",
      label_color: form.label_color,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="category_name">Category Name</Label>
            <Input
              id="category_name"
              value={form.category_name}
              onChange={e =>
                setForm(prev => ({ ...prev, category_name: e.target.value }))
              }
              placeholder="e.g. Weight"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={form.description || ""}
              onChange={e =>
                setForm(prev => ({ ...prev, description: e.target.value }))
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
                value={form.label_color}
                onChange={e =>
                  setForm(prev => ({ ...prev, label_color: e.target.value }))
                }
              />
              <Input
                value={form.label_color}
                onChange={e =>
                  setForm(prev => ({ ...prev, label_color: e.target.value }))
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
            <Button type="submit" disabled={isSubmitting || !form.category_name.trim()}>
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                  ? "Create"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
