import { useState, useRef, useEffect } from "react";
import { Upload, Crop, Maximize2, Trash2, Check, Move, RotateCw, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

type Position = { x: number; y: number };
type AspectType = "avatar" | "landscape" | "portrait";

interface ImageUploadProps {
  label?: string;
  defaultImage?: string;
  onChange?: (file: File | null) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, defaultImage, onChange }) => {
  const [file, setFile] = useState<File | null>(null); // original uploaded file
  const [preview, setPreview] = useState<string | null>(defaultImage || null); // displayed image
  const [tempPreview, setTempPreview] = useState<string | null>(null); // modal temp
  const [isDragging, setIsDragging] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [aspect, setAspect] = useState<AspectType>("avatar");
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const dragStart = useRef<Position>({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* --- Handlers --- */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setTempPreview(objectUrl); // modal temp
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setIsEditModalOpen(true); // open modal immediately
    if (onChange) onChange(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;
    setFile(droppedFile);
    const objectUrl = URL.createObjectURL(droppedFile);
    setPreview(objectUrl);
    setTempPreview(objectUrl);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setIsEditModalOpen(true);
    if (onChange) onChange(droppedFile);
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(defaultImage || null);
    setTempPreview(defaultImage || null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onChange) onChange(null);
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  /* --- Drag-to-pan --- */
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingImage(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDraggingImage) return;
    setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  const onMouseUp = () => setIsDraggingImage(false);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDraggingImage]);

  /* --- Aspect classes --- */
  const getModalAspectClass = () => {
    switch (aspect) {
      case "avatar": return { width: 400, height: 400, class: "aspect-square w-[400px] h-[400px]" };
      case "landscape": return { width: 500, height: 280, class: "aspect-video w-[500px] h-[280px]" };
      case "portrait": return { width: 320, height: 420, class: "aspect-[3/4] w-[320px] h-[420px]" };
      default: return { width: 400, height: 400, class: "aspect-square w-[400px] h-[400px]" };
    }
  };

  const getPreviewAspectClass = () => {
    switch (aspect) {
      case "avatar": return "aspect-square w-64";
      case "landscape": return "aspect-video w-80";
      case "portrait": return "aspect-[3/4] w-64";
      default: return "aspect-square w-64";
    }
  };

  /* --- Generate edited image --- */
  const generateEditedImage = (outputWidth = 1200): Promise<File> => {
    return new Promise((resolve) => {
      if (!file || !preview) return;
      const img = new Image();
      img.src = preview;
      img.onload = () => {
        // Determine canvas height based on aspect ratio
        const aspectClass = getModalAspectClass();
        const aspectRatio = aspectClass.width / aspectClass.height;
        const canvasWidth = outputWidth;
        const canvasHeight = Math.round(canvasWidth / aspectRatio);

        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext("2d")!;

        // Scale image to cover canvas
        const scale = Math.max(canvasWidth / img.width, canvasHeight / img.height);

        const drawWidth = img.width * scale * zoom;
        const drawHeight = img.height * scale * zoom;

        const centerX = canvasWidth / 2 - drawWidth / 2 + (position.x / aspectClass.width) * canvasWidth;
        const centerY = canvasHeight / 2 - drawHeight / 2 + (position.y / aspectClass.height) * canvasHeight;

        ctx.drawImage(img, centerX, centerY, drawWidth, drawHeight);

        canvas.toBlob((blob) => {
          if (!blob) return;
          resolve(new File([blob], file.name, { type: file.type }));
        }, file.type, 1); // quality 1 = max
      };
    });
  };


  const handleApply = async () => {
    if (!file || !tempPreview) return;
    const editedFile = await generateEditedImage();
    const objectUrl = URL.createObjectURL(editedFile);
    setFile(editedFile);
    setPreview(objectUrl);
    setTempPreview(objectUrl); // ensure next edit works correctly
    setIsEditModalOpen(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    if (onChange) onChange(editedFile);
  };

  /* --- JSX --- */
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-semibold">{label}</label>}

      {/* Empty State */}
      {!preview ? (
        <div
          className={`relative group cursor-pointer flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed transition-all duration-200 ${isDragging ? "border-[#5c52d6] bg-[#5c52d6]/5" : "border-gray-200 dark:border-gray-700 hover:border-[#5c52d6]/50 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
            <Upload className="w-6 h-6 text-gray-500 dark:text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">SVG, PNG, JPG | Max 2 MB</p>
          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
        </div>
      ) : (
        <div className="relative flex flex-col lg:flex-row items-start gap-4 p-4 border rounded-xl border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className={`relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border ${getPreviewAspectClass()}`}>
            {preview && (
              <div
                className="w-full h-full cursor-move"
                onMouseDown={onMouseDown}
                style={{
                  backgroundImage: `url(${preview})`,
                  backgroundSize: `${zoom * 100}%`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  transition: isDraggingImage ? "none" : "transform 0.2s",
                }}
              />
            )}
          </div>

          <div className="flex-1 min-w-0 pt-1">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{file?.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{file ? (file.size / 1024).toFixed(0) : 0} KB • Image</p>

            <div className="flex gap-2 mt-4 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => { setTempPreview(preview); setIsEditModalOpen(true); }} className="flex items-center gap-2">
                <Edit className="w-4 h-4" /> Edit Image
              </Button>
              <Button variant="destructive" size="sm" onClick={handleRemove} className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && tempPreview && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-auto">
          <div className="rounded-2xl shadow-2xl w-full max-w-5xl sm:h-[65vh] flex flex-col sm:flex-row overflow-hidden">
            {/* Left: Image */}
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center p-4 sm:p-8 overflow-auto">
              <div className={`relative overflow-hidden rounded-lg ${getModalAspectClass().class}`}>
                <img
                  src={tempPreview}
                  alt="Edit Preview"
                  className="absolute top-0 left-0 w-full h-full cursor-move select-none object-cover"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    transformOrigin: "center",
                    transition: isDraggingImage ? "none" : "transform 0.2s",
                  }}
                  onMouseDown={onMouseDown}
                />
                {/* Grid guides */}
                <div className="absolute inset-0 border-2 border-gray-600 dark:border-gray-400 border-dashed pointer-events-none opacity-50 grid grid-cols-3 grid-rows-3">
                  <div className="border-r border-white/30 dark:border-white/20"></div>
                  <div className="border-r border-white/30 dark:border-white/20"></div>
                  <div className="border-b border-white/30 dark:border-white/20 col-span-3 row-start-1"></div>
                  <div className="border-b border-white/30 dark:border-white/20 col-span-3 row-start-2"></div>
                </div>
              </div>
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black/70 text-white text-xs px-2 sm:px-3 py-1 rounded-full backdrop-blur-md pointer-events-none">
                Adjustment Preview
              </div>
            </div>

            {/* Right: Controls */}
            <div className="w-full sm:w-80 bg-white dark:bg-gray-900 border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-gray-700 flex flex-col">
              <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Edit Image</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Zoom, move, and select aspect ratio</p>
              </div>
              <div className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
                {/* Zoom */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Maximize2 className="w-4 h-4 text-gray-400 dark:text-gray-300" /> Zoom
                    </label>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{(zoom * 100).toFixed(0)}%</span>
                  </div>
                  <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#5c52d6]" />
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Move className="w-4 h-4 text-gray-400 dark:text-gray-300" /> Pan (X / Y)
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 dark:text-gray-300">Horizontal</label>
                      <input type="number" value={position.x} onChange={(e) => setPosition({ ...position, x: Number(e.target.value) })} className="w-full px-2 py-1 border rounded-md text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 dark:text-gray-300">Vertical</label>
                      <input type="number" value={position.y} onChange={(e) => setPosition({ ...position, y: Number(e.target.value) })} className="w-full px-2 py-1 border rounded-md text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
                    </div>
                  </div>
                </div>

                {/* Aspect */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Crop className="w-4 h-4 text-gray-400 dark:text-gray-300" /> Aspect
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button variant={aspect === "avatar" ? "default" : "outline"} size="sm" onClick={() => setAspect("avatar")}>Avatar</Button>
                    <Button variant={aspect === "landscape" ? "default" : "outline"} size="sm" onClick={() => setAspect("landscape")}>Landscape</Button>
                    <Button variant={aspect === "portrait" ? "default" : "outline"} size="sm" onClick={() => setAspect("portrait")}>Portrait</Button>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                  Adjustments are applied to the thumbnail preview only. The original file is preserved until you click Apply.
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 grid grid-cols-3 gap-2">
                <Button variant="failure" size="sm" onClick={handleReset} className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4" /> Reset
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleApply} className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
