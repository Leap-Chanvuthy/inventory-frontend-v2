import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Check, Palette } from "lucide-react";
import { useRef } from "react";

type ColorPickerInputProps = {
  id?: string;
  label?: string;
  error?: string;
  value?: string;
  onChange?: (color: string) => void;
  colors?: string[];
};

const DEFAULT_COLORS = [
  "#6366F1", // Indigo
  "#8B5CF6", // Purple
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#3B82F6", // Blue
  "#10B981", // Green
  "#EC4899", // Pink
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#84CC16", // Lime
];

export const ColorPickerInput = ({
  id,
  label,
  error,
  value,
  onChange,
  colors = DEFAULT_COLORS,
}: ColorPickerInputProps) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const isCustomColor = value && !colors.includes(value.toUpperCase());

  const handleCustomColorClick = () => {
    colorInputRef.current?.click();
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value.toUpperCase());
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hexValue = e.target.value.toUpperCase();
    if (!hexValue.startsWith("#")) {
      hexValue = "#" + hexValue;
    }
    if (/^#[0-9A-F]{0,6}$/.test(hexValue)) {
      onChange?.(hexValue);
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <Label
          htmlFor={id}
          className={
            error ? "text-red-500" : "text-gray-700 dark:text-gray-300"
          }
        >
          {label}
        </Label>
      )}

      <div className="space-y-3">
        <div className="flex flex-wrap gap-3 items-center">
          {colors.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => onChange?.(color)}
              className="relative w-10 h-10 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            >
              {value?.toUpperCase() === color.toUpperCase() && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check
                    className="w-5 h-5 text-white drop-shadow-md"
                    strokeWidth={3}
                  />
                </div>
              )}
            </button>
          ))}

          {/* Custom Color Picker Button */}
          <div className="relative">
            <button
              type="button"
              onClick={handleCustomColorClick}
              className="relative w-10 h-10 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 transition-all hover:scale-110 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center"
              style={{
                backgroundColor: isCustomColor ? value : "transparent",
              }}
              aria-label="Pick custom color"
            >
              {isCustomColor ? (
                <Check
                  className="w-5 h-5 text-white drop-shadow-md"
                  strokeWidth={3}
                />
              ) : (
                <Palette className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              )}
            </button>

            {/* Native color input positioned over button */}
            <input
              ref={colorInputRef}
              type="color"
              value={value || "#6366F1"}
              onChange={handleColorInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Custom color picker"
            />
          </div>
        </div>

        {/* Hex Input */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Enter hex code :
          </span>
          <Input
            type="text"
            value={value || ""}
            onChange={handleHexInputChange}
            placeholder="#000000"
            maxLength={7}
            className="w-32 font-mono text-sm"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
