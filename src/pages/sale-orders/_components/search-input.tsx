import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, placeholder, onChange }: SearchInputProps) {
  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        className="h-9 rounded-md border-transparent bg-muted pl-9 pr-3 text-sm shadow-none focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20"
        value={value}
        onChange={event => onChange(event.target.value)}
      />
    </div>
  );
}
