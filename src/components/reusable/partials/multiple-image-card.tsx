import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Image {
  id: number | string;
  image: string;
}

interface MultipleImageCardProps {
  images?: Image[];
  title?: string;
  description?: string;
  className?: string;
}

export const MultipleImageCard = ({
  images = [],
  title = "Images",
  description,
  className = "",
}: MultipleImageCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasImages = images.length > 0;

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 sm:p-6 ${className}`}>
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
        {title}
      </h2>

      {hasImages ? (
        <div className="relative">
          {/* Image Carousel */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden touch-pan-y">
            <img
              src={images[currentImageIndex].image}
              alt={`Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-primary/90 text-primary-foreground rounded-full p-1.5 sm:p-2 hover:bg-primary transition-all shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-primary/90 text-primary-foreground rounded-full p-1.5 sm:p-2 hover:bg-primary transition-all shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs sm:text-sm px-2 py-1 rounded-md">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 sm:mt-4 overflow-x-auto pb-2 scrollbar-thin">
              {images.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={img.image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      ) : (
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <p className="text-sm sm:text-base text-muted-foreground">
            No images available
          </p>
        </div>
      )}
    </div>
  );
};
