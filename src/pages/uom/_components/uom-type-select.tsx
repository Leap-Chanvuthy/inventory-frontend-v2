import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface UOMTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

export const UOMTypeSelect = ({
  value,
  onValueChange,
  error,
  required = false,
  disabled = false,
  label = "UOM Type",
  placeholder = "Select UOM type",
}: UOMTypeSelectProps) => {
  return (
    <div>
      {label && (
        <Label htmlFor="uom_type">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </Label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="mt-2">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="COUNT">Count</SelectItem>
          <SelectItem value="WEIGHT">Weight</SelectItem>
          <SelectItem value="VOLUME">Volume</SelectItem>
          <SelectItem value="LENGTH">Length</SelectItem>
          <SelectItem value="AREA">Area</SelectItem>
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
