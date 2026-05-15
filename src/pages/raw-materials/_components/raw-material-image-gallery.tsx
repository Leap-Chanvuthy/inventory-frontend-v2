import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/reusable/partials/image-upload";
import { useDeleteRawMaterialImages, useUploadRawMaterialImages } from "@/api/raw-materials/raw-material.mutation";

interface RawMaterialImageGalleryProps {
  rawMaterialId: number;
  images?: Array<{ id: number; image: string }>;
}

export function RawMaterialImageGallery({ rawMaterialId, images = [] }: RawMaterialImageGalleryProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploaderKey, setUploaderKey] = useState(0);

  const uploadMutation = useUploadRawMaterialImages(rawMaterialId);
  const deleteMutation = useDeleteRawMaterialImages(rawMaterialId);

  const orderedImages = useMemo(() => {
    return [...images].sort((a, b) => a.id - b.id);
  }, [images]);

  const canUpload = !!selectedFile && !uploadMutation.isPending;

  const onUpload = () => {
    if (!canUpload) return;

    const formData = new FormData();
    formData.append("images[]", selectedFile as File);

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        setSelectedFile(null);
        setUploaderKey(prev => prev + 1);
      },
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Material Images</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Upload JPG, JPEG, PNG, or WEBP images for this raw material.
            </p>
          </div>
          <Badge variant="outline">Total: {orderedImages.length}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-lg border p-3 bg-muted/20">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-3 items-start">
            <ImageUpload
              key={uploaderKey}
              label="Select Raw Material Image"
              onChange={file => setSelectedFile(file)}
            />
            <Button type="button" onClick={onUpload} disabled={!canUpload}>
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>
        </div>

        {orderedImages.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">
            No images available.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {orderedImages.map(image => (
              <div key={image.id} className="rounded-lg border overflow-hidden bg-card">
                <div className="relative h-40 bg-muted/30">
                  <img src={image.image} alt={`raw-material-${image.id}`} className="w-full h-full object-cover" />
                </div>
                <div className="p-2 flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate([image.id])}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
