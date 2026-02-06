import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export type ImageItem = {
    id: number;
    raw_material_id: number;
    image: string;
    created_at?: string;
    updated_at?: string;
};

interface ImageDeleteCardProps {
    title?: string;
    images: ImageItem[];
    onDelete: (ids: number[]) => Promise<void> | void;
    isDeleting?: boolean;
}

export default function SelectableImageDelete({
    title = "Images",
    images,
    onDelete,
    isDeleting = false,
}: ImageDeleteCardProps) {
    const [selected, setSelected] = useState<number[]>([]);
    const [open, setOpen] = useState(false);
    const allSelected = images.length > 0 && selected.length === images.length;
    const someSelected = selected.length > 0 && selected.length < images.length;

    const selectAllState: boolean | "indeterminate" = allSelected
        ? true
        : someSelected
          ? "indeterminate"
          : false;

    const toggleSelectAll = (checked: boolean | "indeterminate") => {
        if (isDeleting) return;
        const nextChecked = checked === true || checked === "indeterminate";
        setSelected(nextChecked ? images.map((i) => i.id) : []);
    };

    const toggleSelect = (id: number) => {
        if (isDeleting) return;
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleDelete = async () => {
        if (isDeleting || selected.length === 0) return;
        await onDelete(selected);
        setSelected([]);
        setOpen(false);
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{title}</CardTitle>
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={selectAllState}
                        onCheckedChange={toggleSelectAll}
                        disabled={isDeleting}
                    />
                    <span className="text-sm text-muted-foreground">Select all</span>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {images.length === 0 && (
                    <p className="text-sm text-muted-foreground">No images found.</p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className="relative rounded-2xl overflow-hidden border"
                        >
                            <img
                                src={img.image}
                                alt={img.image ?? "image"}
                                className="h-32 w-full object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-white/80 rounded-md p-1">
                                <Checkbox
                                    checked={selected.includes(img.id)}
                                    onCheckedChange={() => toggleSelect(img.id)}
                                    disabled={isDeleting}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end">
                    <Button
                        variant="destructive"
                        disabled={selected.length === 0 || isDeleting}
                        type="button"
                        onClick={() => setOpen(true)}
                    >
                        Delete selected ({selected.length})
                    </Button>
                </div>
            </CardContent>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selected.length} image(s)? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            Yes, delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
