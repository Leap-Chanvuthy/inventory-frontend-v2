import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface EditButtonProps {
  editPath?: string;
  onClick?: () => void;
  label?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const EditButton = ({
  editPath,
  onClick,
  label = "Edit",
  variant = "default",
  size = "sm",
  className = "",
}: EditButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (editPath) {
      navigate(editPath);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`flex items-center gap-2 bg-primary sm:size-default ${className}`}
      onClick={handleClick}
    >
      <Pencil className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
};
