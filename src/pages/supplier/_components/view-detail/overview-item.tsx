import React from "react";
import { Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text/app-text";

interface OverviewItemProps {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  copyable?: boolean;
  onCopy?: () => void;
  badge?: boolean;
}

export function OverviewItem({
  icon,
  label,
  value,
  copyable,
  onCopy,
  badge,
}: OverviewItemProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon && icon}
        <Text.Small className="text-xs">{label}</Text.Small>
      </div>
      {badge ? (
        <Badge className="bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20 shadow-none text-xs">
          {value}
        </Badge>
      ) : copyable ? (
        <button
          onClick={onCopy}
          className="flex items-center justify-between w-full px-2 py-1.5 bg-muted rounded-md hover:bg-muted/70 transition-colors group text-left"
        >
          <span className="text-xs font-semibold">
            {value || "N/A"}
          </span>
          <Copy className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" />
        </button>
      ) : (
        <Text.Small fontWeight="medium" color="default">
          {value || "—"}
        </Text.Small>
      )}
    </div>
  );
}
