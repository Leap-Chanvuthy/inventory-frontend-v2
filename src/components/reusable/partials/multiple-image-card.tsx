import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasImages = images.length > 0;

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 sm:p-6 ${className}`}>
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
        {title}
      </h2>

      {hasImages ? (
        <div className="relative">
          {/* Horizontal Scrolling Carousel */}
          <div className="relative group">
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {images.map((img, index) => (
                <div
                  key={img.id}
                  className="flex-shrink-0 w-40 sm:w-48 lg:w-56 aspect-square rounded-3xl overflow-hidden bg-muted snap-center"
                >
                  <img
                    src={img.image}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => scroll("left")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3 sm:p-4 transition-all shadow-lg z-10 opacity-0 group-hover:opacity-100"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3 sm:p-4 transition-all shadow-lg z-10 opacity-0 group-hover:opacity-100"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
                </button>
              </>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
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
