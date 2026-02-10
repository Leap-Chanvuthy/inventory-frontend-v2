import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CalendarIcon } from "lucide-react";
import { format, isValid } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type TextInputProps = {
  type?: "text" | "email" | "password" | "tel" | "number";
  id: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isNumberOnly?: boolean;
  maxLength?: number;
  allowPaste?: boolean;
};

type TextAreaInputProps = {
  id: string;
  placeholder?: string;
  error?: string;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  maxLength?: number;
};

type SelectInputProps = {
  id: string;
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
};

export const TextInput = ({
  type = "text",
  id,
  placeholder,
  required,
  error,
  label,
  value,
  onChange,
  isNumberOnly = false,
  maxLength,
  allowPaste = true,
}: TextInputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const isPassword = type === "password";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumberOnly) {
      // Filter out non-numeric characters
      const numericValue = e.target.value.replace(/\D/g, "");
      e.target.value = numericValue;
    }
    onChange?.(e);
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
          {required && <span className="text-red-500 px-1">*</span>}
        </Label>
      )}

      <div className="relative">
        <Input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          onPaste={!allowPaste ? (e) => e.preventDefault() : undefined}
          className={`pr-10 ${error ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="
              absolute inset-y-0 right-0 flex items-center pr-3
              text-gray-400 hover:text-gray-600
              dark:hover:text-gray-300
            "
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export const TextAreaInput = ({
  id,
  placeholder,
  error,
  label,
  value,
  onChange,
  required = false,
  maxLength,
}: TextAreaInputProps) => {
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
          {required && <span className="text-red-500 px-1">*</span>}
        </Label>
      )}

      <div>
        <Textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          className={`pr-10 ${error ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export const SelectInput = ({
  id,
  label,
  placeholder,
  options,
  error,
  value,
  onChange,
  required = false,
}: SelectInputProps) => {
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
          {required && <span className="text-red-500 px-1">*</span>}
        </Label>
      )}

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className={error ? "border-red-500" : ""}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};


// Date Input Calender
export type DateInputProps = {
  id: string;
  label?: string;
  placeholder?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  displayFormat?: string;
};

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function formatISODateLocal(date: Date | undefined) {
  if (!date) return ""
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

function parseYMD(value: string) {
  const match = value.match(/^\s*(\d{4})-(\d{2})-(\d{2})\s*$/)
  if (!match) return undefined
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return undefined
  const date = new Date(year, month - 1, day)
  return isValid(date) ? date : undefined
}

function coerceToDate(value?: string) {
  if (!value) return undefined
  const ymd = parseYMD(value)
  if (ymd) return ymd
  const parsed = new Date(value)
  return isValid(parsed) ? parsed : undefined
}

export const DatePickerInput = ({
  id,
  label,
  placeholder,
  error,
  value,
  onChange,
  required = false,
  disabled = false,
  className,
  buttonClassName,
  displayFormat = "PPP",
}: DateInputProps) => {
  const isControlled = value !== undefined

  const [internalDate, setInternalDate] = React.useState<Date | undefined>(() =>
    isControlled ? coerceToDate(value) : undefined,
  )

  React.useEffect(() => {
    if (!isControlled) return
    setInternalDate(coerceToDate(value))
  }, [isControlled, value])

  const selectedDate = isControlled ? coerceToDate(value) : internalDate
  const triggerId = `${id}-date-trigger`

  return (
    <div className={cn("space-y-2 w-full", className)}>
      {label && (
        <Label
          htmlFor={triggerId}
          className={error ? "text-red-500" : "text-gray-700 dark:text-gray-300"}
        >
          {label}
          {required && <span className="text-red-500 px-1">*</span>}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={triggerId}
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
              error && "border-red-500 focus-visible:ring-red-500",
              buttonClassName,
            )}
            type="button"
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, displayFormat) : (
              <span>{placeholder ?? "Pick a date"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (!isControlled) {
                setInternalDate(date)
              }
              onChange?.(formatISODateLocal(date))
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}