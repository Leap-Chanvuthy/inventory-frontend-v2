import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick?: () => void;
  label?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
}

export const DeleteButton = ({
  onClick,
  label = "Delete",
  variant = "destructive",
  size = "sm",
  className = "",
  disabled = false,
}: DeleteButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={`flex items-center gap-2 sm:size-default ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Trash2 className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
};
