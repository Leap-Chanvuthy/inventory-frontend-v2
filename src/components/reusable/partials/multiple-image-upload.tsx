import { useState, useRef, useEffect } from "react";
import { Upload, Crop, Maximize2, Trash2, Check, Move, RotateCw, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

type Position = { x: number; y: number };
type AspectType = "avatar" | "landscape" | "portrait";

interface MultiImageUploadProps {
  label?: string;
  defaultImages?: string[]; // optional array of default images
  onChange?: (files: File[]) => void;
}

interface ImageItem {
  id: string;
  file: File | null;
  preview: string | null;
  tempPreview: string | null;
  zoom: number;
  position: Position;
  aspect: AspectType;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({ label, defaultImages = [], onChange }) => {
  const [images, setImages] = useState<ImageItem[]>(() =>
    defaultImages.map((img, idx) => ({
      id: `img-${idx}`,
      file: null,
      preview: img,
      tempPreview: img,
      zoom: 1,
      position: { x: 0, y: 0 },
      aspect: "avatar" as AspectType,
    }))
  );

  const [isDragging, setIsDragging] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null); // which image is being edited
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const dragStart = useRef<Position>({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* --- Handlers --- */
  const handleFilesSelect = (files: FileList | null) => {
    if (!files) return;
    const newImages: ImageItem[] = Array.from(files).map((file, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      file,
      preview: URL.createObjectURL(file),
      tempPreview: URL.createObjectURL(file),
      zoom: 1,
      position: { x: 0, y: 0 },
      aspect: "avatar",
    }));
    setImages(prev => [...prev, ...newImages]);
    if (onChange) onChange([...images.map(img => img.file!).filter(Boolean), ...Array.from(files)]);
  };

  const handleRemove = (index: number) => {
    setImages(prev => {
      const copy = [...prev];
      copy.splice(index, 1);
      if (onChange) onChange(copy.map(img => img.file!).filter(Boolean));
      return copy;
    });
  };

  const handleReset = (index: number) => {
    setImages(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], zoom: 1, position: { x: 0, y: 0 } };
      return copy;
    });
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setIsDraggingImage(true);
    dragStart.current = { x: e.clientX - images[index].position.x, y: e.clientY - images[index].position.y };
    setEditIndex(index);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDraggingImage || editIndex === null) return;
    setImages(prev => {
      const copy = [...prev];
      copy[editIndex].position = { x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y };
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

  /* --- Aspect classes --- */
  const getModalAspectClass = (aspect: AspectType) => {
    switch (aspect) {
      case "avatar": return { width: 400, height: 400, class: "aspect-square w-[400px] h-[400px]" };
      case "landscape": return { width: 500, height: 280, class: "aspect-video w-[500px] h-[280px]" };
      case "portrait": return { width: 320, height: 420, class: "aspect-[3/4] w-[320px] h-[420px]" };
      default: return { width: 400, height: 400, class: "aspect-square w-[400px] h-[400px]" };
    }
  };

  const getPreviewAspectClass = (aspect: AspectType) => {
    switch (aspect) {
      case "avatar": return "aspect-square w-32";
      case "landscape": return "aspect-video w-40";
      case "portrait": return "aspect-[3/4] w-32";
      default: return "aspect-square w-32";
    }
  };

  /* --- Generate edited image --- */
  const generateEditedImage = (imgItem: ImageItem, outputWidth = 1200): Promise<File> => {
    return new Promise((resolve) => {
      if (!imgItem.file || !imgItem.tempPreview) return;
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

        const scale = Math.max(canvasWidth / img.width, canvasHeight / img.height);
        const drawWidth = img.width * scale * imgItem.zoom;
        const drawHeight = img.height * scale * imgItem.zoom;

        const centerX = canvasWidth / 2 - drawWidth / 2 + (imgItem.position.x / aspectClass.width) * canvasWidth;
        const centerY = canvasHeight / 2 - drawHeight / 2 + (imgItem.position.y / aspectClass.height) * canvasHeight;

        ctx.drawImage(img, centerX, centerY, drawWidth, drawHeight);

        canvas.toBlob((blob) => {
          if (!blob) return;
          resolve(new File([blob], imgItem.file!.name, { type: imgItem.file!.type }));
        }, imgItem.file.type, 1);
      };
    });
  };

  const handleApply = async (index: number) => {
    const imgItem = images[index];
    const editedFile = await generateEditedImage(imgItem);
    const objectUrl = URL.createObjectURL(editedFile);
    setImages(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], file: editedFile, preview: objectUrl, tempPreview: objectUrl, zoom: 1, position: { x: 0, y: 0 } };
      return copy;
    });
    if (onChange) onChange(images.map(img => img.file!).filter(Boolean));
  };

  /* --- JSX --- */
  return (
    <div className="space-y-4">
      {label && <label className="block text-sm font-semibold">{label}</label>}

      {/* Upload Area */}
      <div
        className={`relative group cursor-pointer flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed transition-all duration-200 ${isDragging ? "border-[#5c52d6] bg-[#5c52d6]/5" : "border-gray-200 dark:border-gray-700 hover:border-[#5c52d6]/50 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFilesSelect(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
          <Upload className="w-6 h-6 text-gray-500 dark:text-gray-300" />
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">SVG, PNG, JPG | Max 2 MB each</p>
        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleFilesSelect(e.target.files)} />
      </div>

      {/* Image Previews */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div key={img.id} className="relative border rounded-lg overflow-hidden">
            {img.preview && (
              <div className={`relative ${getPreviewAspectClass(img.aspect)} bg-gray-100 dark:bg-gray-800`}>
                <img src={img.preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-1">
              <Button size="xs" variant="outline" onClick={() => setEditIndex(index)}><Edit className="w-3 h-3" /></Button>
              <Button size="xs" variant="destructive" onClick={() => handleRemove(index)}><Trash2 className="w-3 h-3" /></Button>
            </div>

            {/* Edit Modal */}
            {editIndex === index && img.tempPreview && (
              <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-auto">
                <div className="rounded-2xl shadow-2xl w-full max-w-5xl sm:h-[65vh] flex flex-col sm:flex-row overflow-hidden">
                  {/* Left: Image */}
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center p-4 sm:p-8 overflow-auto">
                    <div className={`relative overflow-hidden rounded-lg ${getModalAspectClass(img.aspect).class}`}>
                      <img
                        src={img.tempPreview}
                        alt="Edit Preview"
                        className="absolute top-0 left-0 w-full h-full cursor-move select-none object-cover"
                        style={{
                          transform: `translate(${img.position.x}px, ${img.position.y}px) scale(${img.zoom})`,
                          transformOrigin: "center",
                          transition: isDraggingImage ? "none" : "transform 0.2s",
                        }}
                        onMouseDown={(e) => onMouseDown(e, index)}
                      />
                      <div className="absolute inset-0 border-2 border-gray-600 dark:border-gray-400 border-dashed pointer-events-none opacity-50 grid grid-cols-3 grid-rows-3">
                        <div className="border-r border-white/30 dark:border-white/20"></div>
                        <div className="border-r border-white/30 dark:border-white/20"></div>
                        <div className="border-b border-white/30 dark:border-white/20 col-span-3 row-start-1"></div>
                        <div className="border-b border-white/30 dark:border-white/20 col-span-3 row-start-2"></div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Controls */}
                  <div className="w-full sm:w-80 bg-white dark:bg-gray-900 border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-gray-700 flex flex-col">
                    <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Edit Image</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Zoom, move, and select aspect ratio</p>
                    </div>
                    <div className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Maximize2 className="w-4 h-4 text-gray-400 dark:text-gray-300" /> Zoom
                          </label>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{(img.zoom * 100).toFixed(0)}%</span>
                        </div>
                        <input type="range" min="1" max="3" step="0.1" value={img.zoom} onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setImages(prev => {
                            const copy = [...prev];
                            copy[index].zoom = val;
                            return copy;
                          });
                        }} className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#5c52d6]" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Move className="w-4 h-4 text-gray-400 dark:text-gray-300" /> Pan (X / Y)
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-xs text-gray-400 dark:text-gray-300">Horizontal</label>
                            <input type="number" value={img.position.x} onChange={(e) => {
                              const val = Number(e.target.value);
                              setImages(prev => {
                                const copy = [...prev];
                                copy[index].position.x = val;
                                return copy;
                              });
                            }} className="w-full px-2 py-1 border rounded-md text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-gray-400 dark:text-gray-300">Vertical</label>
                            <input type="number" value={img.position.y} onChange={(e) => {
                              const val = Number(e.target.value);
                              setImages(prev => {
                                const copy = [...prev];
                                copy[index].position.y = val;
                                return copy;
                              });
                            }} className="w-full px-2 py-1 border rounded-md text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Crop className="w-4 h-4 text-gray-400 dark:text-gray-300" /> Aspect
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {(["avatar", "landscape", "portrait"] as AspectType[]).map(a => (
                            <Button key={a} variant={img.aspect === a ? "default" : "outline"} size="sm" onClick={() => {
                              setImages(prev => {
                                const copy = [...prev];
                                copy[index].aspect = a;
                                return copy;
                              });
                            }}>{a.charAt(0).toUpperCase() + a.slice(1)}</Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 grid grid-cols-3 gap-2">
                      <Button variant="failure" size="sm" onClick={() => handleReset(index)} className="flex items-center gap-2">
                        <RotateCw className="w-4 h-4" /> Reset
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditIndex(null)}>Cancel</Button>
                      <Button variant="primary" size="sm" onClick={() => { handleApply(index); setEditIndex(null); }} className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> Apply
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
