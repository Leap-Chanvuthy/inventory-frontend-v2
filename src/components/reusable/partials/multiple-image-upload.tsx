import { useState, useRef, useEffect } from "react";
import { Upload, Maximize2, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Position = { x: number; y: number };
type AspectType = "avatar" | "landscape" | "portrait";

interface MultiImageUploadProps {
  label?: string;
  defaultImages?: string[];
  defaultImageIds?: number[];
  maxImages?: number;
  onChange?: (files: File[]) => void;
  onDeleteExisting?: (imageId: number) => void;
  showEdit?: boolean;
}

interface ImageItem {
  id: string;
  imageId?: number; // ID of existing image from server
  file: File | null;
  preview: string;
  tempPreview: string;
  zoom: number;
  position: Position;
  aspect: AspectType;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  label,
  defaultImages = [],
  defaultImageIds = [],
  maxImages,
  onChange,
  onDeleteExisting,
  showEdit = true,
}) => {
  const [images, setImages] = useState<ImageItem[]>(() =>
    defaultImages.map((url, idx) => ({
      id: `img-${idx}`,
      imageId: defaultImageIds[idx], // Track existing image ID
      file: null,
      preview: url,
      tempPreview: url,
      zoom: 1,
      position: { x: 0, y: 0 },
      aspect: "avatar",
    }))
  );

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const dragStart = useRef<Position>({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Update images when defaultImages changes (e.g., when warehouse data loads)
  // Only run this once when component first mounts and data loads
  useEffect(() => {
    if (defaultImages.length > 0 && !hasInitialized) {
      setImages(
        defaultImages.map((url, idx) => ({
          id: `img-${idx}`,
          imageId: defaultImageIds[idx],
          file: null,
          preview: url,
          tempPreview: url,
          zoom: 1,
          position: { x: 0, y: 0 },
          aspect: "avatar" as AspectType,
        }))
      );
      setHasInitialized(true);
    }
  }, [defaultImages, defaultImageIds, hasInitialized]);

  // --- Drag pan
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setIsDraggingImage(true);
    dragStart.current = {
      x: e.clientX - images[index].position.x,
      y: e.clientY - images[index].position.y,
    };
    setEditIndex(index);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDraggingImage || editIndex === null) return;
    setImages(prev => {
      const copy = [...prev];
      copy[editIndex].position = {
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      };
      return copy;
    });
  };

  const onMouseUp = () => setIsDraggingImage(false);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDraggingImage, editIndex]);

  // --- Aspect classes
  const getModalAspectClass = (aspect: AspectType) => {
    switch (aspect) {
      case "avatar":
        return {
          width: 400,
          height: 400,
          class: "aspect-square w-[400px] h-[400px]",
        };
      case "landscape":
        return {
          width: 500,
          height: 280,
          class: "aspect-video w-[500px] h-[280px]",
        };
      case "portrait":
        return {
          width: 320,
          height: 420,
          class: "aspect-[3/4] w-[320px] h-[420px]",
        };
      default:
        return {
          width: 400,
          height: 400,
          class: "aspect-square w-[400px] h-[400px]",
        };
    }
  };

  // --- Generate high-res edited image
  const generateEditedImage = (
    imgItem: ImageItem,
    outputWidth = 1200
  ): Promise<File> => {
    return new Promise(resolve => {
      const img = new Image();
      img.src = imgItem.tempPreview;
      img.onload = () => {
        const aspectClass = getModalAspectClass(imgItem.aspect);
        const aspectRatio = aspectClass.width / aspectClass.height;
        const canvasWidth = outputWidth;
        const canvasHeight = Math.round(canvasWidth / aspectRatio);

        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext("2d")!;

        const scale = Math.max(
          canvasWidth / img.width,
          canvasHeight / img.height
        );
        const drawWidth = img.width * scale * imgItem.zoom;
        const drawHeight = img.height * scale * imgItem.zoom;

        const centerX =
          canvasWidth / 2 -
          drawWidth / 2 +
          (imgItem.position.x / aspectClass.width) * canvasWidth;
        const centerY =
          canvasHeight / 2 -
          drawHeight / 2 +
          (imgItem.position.y / aspectClass.height) * canvasHeight;

        ctx.drawImage(img, centerX, centerY, drawWidth, drawHeight);

        canvas.toBlob(
          blob => {
            if (!blob) return;
            resolve(
              new File(
                [blob],
                imgItem.file?.name || `image-${Date.now()}.png`,
                { type: imgItem.file?.type || "image/png" }
              )
            );
          },
          imgItem.file?.type || "image/png",
          1
        );
      };
    });
  };

  // --- Handlers
  const handleFilesSelect = (files: FileList | null) => {
    if (!files) return;

    const max = maxImages ?? Infinity;
    const remainingSlots = max - images.length;

    if (remainingSlots <= 0) return;

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
    const ALLOWED_TYPES = ["image/png", "image/jpeg"];
    const allFiles = Array.from(files);

    const invalidTypeFiles = allFiles.filter(file => !ALLOWED_TYPES.includes(file.type));
    const oversizedFiles = allFiles.filter(file => ALLOWED_TYPES.includes(file.type) && file.size > MAX_FILE_SIZE);

    if (invalidTypeFiles.length > 0) {
      toast.error("Only PNG and JPG files are allowed.");
    }

    if (oversizedFiles.length > 0) {
      toast.error(`${oversizedFiles.length} file(s) exceed 2 MB and were not uploaded.`);
    }

    const acceptedFiles = allFiles
      .filter(file => ALLOWED_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE)
      .slice(0, remainingSlots);

    if (acceptedFiles.length === 0) return;

    const newImages: ImageItem[] = acceptedFiles.map((file, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      file,
      preview: URL.createObjectURL(file),
      tempPreview: URL.createObjectURL(file),
      zoom: 1,
      position: { x: 0, y: 0 },
      aspect: "avatar",
    }));

    setImages(prev => [...prev, ...newImages]);
    onChange?.([
      ...images.map(img => img.file!).filter(Boolean),
      ...acceptedFiles,
    ]);
  };

  const handleRemove = (index: number) => {
    const imageToRemove = images[index];

    // If this is an existing image (has imageId), call onDeleteExisting
    if (imageToRemove.imageId && onDeleteExisting) {
      onDeleteExisting(imageToRemove.imageId);
    }

    setImages(prev => {
      const copy = [...prev];
      copy.splice(index, 1);
      if (onChange) onChange(copy.map(img => img.file!).filter(Boolean));
      return copy;
    });
  };

  const handleApply = async (index: number) => {
    const imgItem = images[index];
    const editedFile = await generateEditedImage(imgItem);
    const objectUrl = URL.createObjectURL(editedFile);
    setImages(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        file: editedFile,
        preview: objectUrl,
        tempPreview: objectUrl,
        zoom: 1,
        position: { x: 0, y: 0 },
      };
      return copy;
    });
    setEditIndex(null);
    if (onChange) onChange(images.map(img => img.file!).filter(Boolean));
  };

  const handleReset = (index: number) => {
    setImages(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], zoom: 1, position: { x: 0, y: 0 } };
      return copy;
    });
  };

  return (
    <div className="space-y-4">
      {label && <label className="block text-sm font-semibold">{label}</label>}

      {/* Upload area */}
      <div
        className="relative group cursor-pointer flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed transition-all duration-200 border-gray-200 dark:border-gray-700 hover:border-[#5c52d6]/50 hover:bg-gray-50 dark:hover:bg-gray-800"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          handleFilesSelect(e.dataTransfer.files);
        }}
      >
        <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
          <Upload className="w-6 h-6 text-gray-500 dark:text-gray-300" />
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          PNG, JPG | Max 2 MB each
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".png,.jpg,.jpeg"
          multiple
          onChange={e => handleFilesSelect(e.target.files)}
        />
      </div>

      {/* Uploaded images - compact row */}
      <div className="space-y-2">
        {images.map((img, index) => (
          <div
            key={img.id}
            className="flex items-center justify-between border rounded-lg overflow-hidden pr-2 py-2 h-20"
          >
            {/* Left: preview */}
            <div className="flex-shrink-0 w-40 h-40 overflow-hidden rounded">
              <img
                src={img.preview}
                alt={`Uploaded ${index}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Middle: name + size */}
            <div className="flex-1 px-2 text-xs truncate">
              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {img.file?.name || `Image ${index + 1}`}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {img.file ? `${(img.file.size / 1024).toFixed(0)} KB` : ""}
              </p>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-1 mx-5">
              {/* Show edit button only for new uploads (has file) or if showEdit is true globally */}
              {(img.file || showEdit) && !img.imageId && (
                <Edit
                  className="cursor-pointer w-3 h-3"
                  onClick={() => setEditIndex(index)}
                />
              )}
              <Trash2
                className="cursor-pointer w-3 h-3 text-red-500"
                onClick={() => handleRemove(index)}
              />
            </div>

            {/* Edit modal */}
            {editIndex === index && (
              <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-auto">
                <div className="rounded-2xl shadow-2xl w-full max-w-5xl sm:h-[65vh] flex flex-col sm:flex-row overflow-hidden">
                  {/* Left image */}
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center p-4 sm:p-8 overflow-auto">
                    <div
                      className={`relative overflow-hidden rounded-lg ${
                        getModalAspectClass(img.aspect).class
                      }`}
                    >
                      <img
                        src={img.tempPreview}
                        alt="Edit Preview"
                        className="absolute top-0 left-0 w-full h-full cursor-move select-none object-cover"
                        style={{
                          transform: `translate(${img.position.x}px, ${img.position.y}px) scale(${img.zoom})`,
                          transition: isDraggingImage
                            ? "none"
                            : "transform 0.2s",
                        }}
                        onMouseDown={e => onMouseDown(e, index)}
                      />
                    </div>
                  </div>

                  {/* Right controls */}
                  <div className="w-full sm:w-80 bg-white dark:bg-gray-900 border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-gray-700 flex flex-col">
                    <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Edit Image
                      </h3>
                    </div>

                    <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto">
                      {/* Zoom */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Maximize2 className="w-4 h-4 text-gray-400 dark:text-gray-300" />{" "}
                            Zoom
                          </label>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            {(img.zoom * 100).toFixed(0)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step={0.1}
                          value={img.zoom}
                          onChange={e => {
                            const val = parseFloat(e.target.value);
                            setImages(prev => {
                              const copy = [...prev];
                              copy[index].zoom = val;
                              return copy;
                            });
                          }}
                          className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer accent-[#5c52d6]"
                        />
                      </div>

                      {/* Pan */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-400 dark:text-gray-300">
                            Horizontal
                          </label>
                          <input
                            type="number"
                            value={img.position.x}
                            onChange={e => {
                              const val = Number(e.target.value);
                              setImages(prev => {
                                const copy = [...prev];
                                copy[index].position.x = val;
                                return copy;
                              });
                            }}
                            className="w-full px-2 py-1 border rounded-md text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-400 dark:text-gray-300">
                            Vertical
                          </label>
                          <input
                            type="number"
                            value={img.position.y}
                            onChange={e => {
                              const val = Number(e.target.value);
                              setImages(prev => {
                                const copy = [...prev];
                                copy[index].position.y = val;
                                return copy;
                              });
                            }}
                            className="w-full px-2 py-1 border rounded-md text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                      </div>

                      {/* Aspect */}
                      <div className="flex flex-wrap gap-2">
                        {(
                          ["avatar", "landscape", "portrait"] as AspectType[]
                        ).map(a => (
                          <Button
                            type="button"
                            key={a}
                            variant={img.aspect === a ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setImages(prev => {
                                const copy = [...prev];
                                copy[index].aspect = a;
                                return copy;
                              });
                            }}
                          >
                            {a.charAt(0).toUpperCase() + a.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant="failure"
                        size="sm"
                        onClick={() => handleReset(index)}
                      >
                        Reset
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditIndex(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleApply(index)}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
