import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CategorySidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategorySidebarSearch({ value, onChange }: CategorySidebarSearchProps) {
  return (
    <div className="relative px-4 py-3 border-b">
      <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-8 text-sm pl-8"
        placeholder="Search categories..."
      />
    </div>
  );
}
