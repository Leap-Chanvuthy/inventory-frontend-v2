import RouteSearch from "../reusable/navigation/route-search";
import { SidebarTrigger } from "../ui/sidebar";
import UserAvatar from "./avatar/user-avatar";
// import LanguageToggle from "./lang/lang-toggle";
import { ThemeToggle } from "./theme/theme-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border h-[72px] px-5 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-6">
        <SidebarTrigger />
        <div className="hidden md:block rounded-md bg-white px-3 py-1.5">
          <img
            src="/assets/logo/camsme-logo-default.svg"
            alt="CAMSME"
            className="h-7 w-auto"
          />
        </div>
        <RouteSearch />
      </div>

      {/* Right */}
      <div className="flex items-center gap-x-4">
        {/* Localization */}
        {/* <LanguageToggle /> */}
        <ThemeToggle />
        <UserAvatar />

        {/* Profile */}
      </div>
    </header>
  );
}
