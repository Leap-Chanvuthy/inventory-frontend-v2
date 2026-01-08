import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NotificationBellProps = {
  /** Number to show in badge (0 hides badge) */
  count?: number;
  /** Click handler */
  onClick?: () => void;
  /** Optional className */
  className?: string;
};

export default function NotificationBell({
  count = 10,
  onClick,
  className,
}: NotificationBellProps) {
  const display = Math.max(0, count);
  const label =
    display > 0 ? `Notifications (${display})` : "Notifications";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label={label}
      className={cn("relative", className)}
    >
      <Bell className="h-5 w-5" />

      {display > 0 && (
        <span
          className={cn(
            "absolute -right-1 -top-1 min-w-[18px] h-[18px] px-1",
            "rounded-full bg-destructive text-destructive-foreground",
            "text-[10px] font-semibold leading-[18px] text-center"
          )}
        >
          {display > 99 ? "99+" : display}
        </span>
      )}
    </Button>
  );
}