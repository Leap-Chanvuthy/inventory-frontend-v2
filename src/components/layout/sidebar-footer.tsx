import {
  ChevronsUpDown,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PROFILE_SIDEBAR_MENU_ITEMS } from "@/pages/profile/page";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ProfileTab } from "@/components/reusable/partials/profile-sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/auth-slice";

export default function SidebarFooterComponent() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Accept both keys; keep `tabs` as the canonical one.
  const activeTab =
    ((searchParams.get("tab")) as ProfileTab) || "profile";

  const selectTab = (tab: ProfileTab) => {
    setOpen(false);
    navigate(`/profile?tab=${encodeURIComponent(tab)}`);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 px-2">
          <Avatar className="size-6 rounded-lg">
            <AvatarImage src={user?.profile_picture || "/images/avatars/01.png"} alt={user?.name} />
            <AvatarFallback className="rounded-lg">{user?.name?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <div className="truncate">{user?.name}</div>
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage src={user?.profile_picture || '/images/avatars/01.png'} alt={user?.name} />
              <AvatarFallback className="rounded-lg">{user?.name?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user?.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {PROFILE_SIDEBAR_MENU_ITEMS.map((item) => (
            <DropdownMenuItem
              key={item.tab}
              onSelect={() => selectTab(item.tab)}
              className={cn(activeTab === item.tab && "bg-muted")}
            >
              {item.icon}
              {item.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => {
            setOpen(false);
            dispatch(logout());
          }}
          className="text-red-600"
        >
          <LogOut size={16} className="text-red-600" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}