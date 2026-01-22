import RouteSearch from "../reusable/navigation/route-search";
import { SidebarTrigger } from "../ui/sidebar";
import UserAvatar from "./avatar/user-avatar";
// import LanguageToggle from "./lang/lang-toggle";
import NotificationBell from "./notificaton/notification-bell";
import { ThemeToggle } from "./theme/theme-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border h-[72px] px-5 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-6">
        <SidebarTrigger />
        <RouteSearch />
      </div>

      {/* Right */}
      <div className="flex items-center gap-x-4">
        {/* Localization */}
        {/* <LanguageToggle /> */}
        <ThemeToggle />
        <NotificationBell />
        <UserAvatar />

        {/* Profile */}
      </div>
    </header>
  );
}
