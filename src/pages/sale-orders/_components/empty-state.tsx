import { Package } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/80">
        <Package className="h-6 w-6 text-muted-foreground/90" />
      </div>
      <h4 className="mb-1 text-sm font-medium text-foreground">{title}</h4>
      <p className="max-w-[220px] text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
