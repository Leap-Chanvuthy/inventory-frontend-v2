import * as React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type ProfileTab = "profile" | "two-factor-auth" | "appearance" | "notifications";

interface SidebarNavProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  items: {
    title: string;
    tab: ProfileTab;
    icon: React.ReactNode;
  }[];
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

export function ProfileSidebar({
  className,
  items,
  activeTab,
  onChange,
  ...props
}: SidebarNavProps) {
  return (
    <nav className={cn("flex flex-col space-y-1 mb-3 rounded-md h-full p-2", className)} {...props}>
      {items.map((item) => (
        <button
          key={item.tab}
          type="button"
          onClick={() => onChange(item.tab)}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "justify-start hover:bg-muted w-full",
            activeTab === item.tab ? "bg-primary text-white hover:bg-muted" : ""
          )}
        >
          {item.icon}
          <span className="ml-2">{item.title}</span>
        </button>
      ))}
    </nav>
  );
}