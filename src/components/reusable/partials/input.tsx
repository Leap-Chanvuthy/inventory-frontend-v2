import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { SelectValue } from "@radix-ui/react-select"
import { Textarea } from "@/components/ui/textarea"

type TextInputProps = {
    type?: "text" | "email" | "password" | "tel" | "number"
    id?: string
    placeholder?: string
    error?: string
    label?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

type TextAreaInputProps = {
    id?: string
    placeholder?: string
    error?: string
    label?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

type SelectInputProps = {
  id?: string
  label?: string
  placeholder?: string
  options: { value: string; label: string }[]
  error?: string
  value?: string
  onChange?: (value: string) => void
}

export const TextInput = ({
    type = "text",
    id,
    placeholder,
    error,
    label,
    value,
    onChange,
}: TextInputProps) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const isPassword = type === "password"

    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <Label
                    htmlFor={id}
                    className={error ? "text-red-500" : "text-gray-700 dark:text-gray-300"}
                >
                    {label}
                </Label>
            )}

            <div className="relative">
                <Input
                    id={id}
                    type={isPassword && showPassword ? "text" : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`pr-10 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />

                {/* Password Toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
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

            {error && (
                <p className="text-xs text-red-500">{error}</p>
            )}
        </div>
    )
}


export const TextAreaInput = ({ id, placeholder, error, label, value, onChange }: TextAreaInputProps) => {
    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <Label
                    htmlFor={id}
                    className={error ? "text-red-500" : "text-gray-700 dark:text-gray-300"}
                >
                    {label}
                </Label>
            )}

            <div>
                <Textarea
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`pr-10 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
            </div>

            {error && (
                <p className="text-xs text-red-500">{error}</p>
            )}
        </div>
    )

}


export const SelectInput = ({
  id,
  label,
  placeholder,
  options,
  error,
  value,
  onChange,
}: SelectInputProps) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <Label
          htmlFor={id}
          className={error ? "text-red-500" : "text-gray-700 dark:text-gray-300"}
        >
          {label}
        </Label>
      )}

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
