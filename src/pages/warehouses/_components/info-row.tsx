import { ReactNode } from "react";

export const InfoRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon: ReactNode;
}) => (
  <div className="flex gap-4">
    <div className="mt-1">{icon}</div>
    <div className="flex flex-col">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
        {label}
      </span>
      <span
        className={`text-base font-semibold ${!value ? "text-muted-foreground italic" : "text-foreground"}`}
      >
        {value || "Not provided"}
      </span>
    </div>
  </div>
);
