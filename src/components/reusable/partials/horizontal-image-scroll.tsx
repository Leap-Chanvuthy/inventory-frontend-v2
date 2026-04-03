import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ImageOff } from "lucide-react";

interface ImageItem {
  id: number;
  image: string;
}

interface HorizontalImageScrollProps {
  images: ImageItem[];
  imageWidth?: string;
  imageHeight?: string;
  gap?: string;
  emptyMessage?: string;
}

export const HorizontalImageScroll = ({
  images,
  imageWidth = "400px",
  imageHeight = "280px",
  gap = "1rem",
  emptyMessage = "No images available",
}: HorizontalImageScrollProps) => {
  return (
    <ScrollArea className="w-full rounded-md">
      <div className="flex items-center pb-4" style={{ gap }}>
        {images && images.length > 0 ? (
          images.map((img, index) => (
            <div
              key={img.id}
              className="flex-shrink-0 overflow-hidden rounded-lg border border-border shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-card"
              style={{ width: imageWidth, height: imageHeight }}
            >
              <img
                src={img.image}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <div
            className="flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed border-border gap-2 mx-auto"
            style={{ height: imageHeight }}
          >
            <div className="p-3 rounded-full bg-muted">
              <ImageOff className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
