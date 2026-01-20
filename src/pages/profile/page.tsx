import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./_components/profile-form";
import { ProfileSidebar } from "@/components/reusable/partials/profile-sidebar";
import { User, Palette, Bell, LockKeyhole, MailCheck } from "lucide-react";
import { ProfileTab } from "@/components/reusable/partials/profile-sidebar";
import { useSearchParams } from "react-router-dom";
import { TwoFactorAuth } from "./_components/two-factor-auth";
import { AppearanceSetting } from "./_components/appearance-setting";
import SidebarFooter from "@/components/layout/sidebar-footer";
import { ForgetPassword } from "./_components/forget-password";

export const PROFILE_SIDEBAR_MENU_ITEMS: {
  title: string;
  tab: ProfileTab;
  icon: React.ReactNode;
}[] = [
  { title: "Profile", tab: "profile", icon: <User className="w-4 h-4" /> },
  { title: "Forget Password", tab: "forget-password", icon: <MailCheck className="w-4 h-4" /> },
  { title: "Two Factor Auth", tab: "two-factor-auth", icon: <LockKeyhole className="w-4 h-4" /> },
  { title: "Appearance", tab: "appearance", icon: <Palette className="w-4 h-4" /> },
  { title: "Notifications", tab: "notifications", icon: <Bell className="w-4 h-4" /> },
];

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = (searchParams.get("tab") as ProfileTab) || "profile";

  const setTab = (tab: ProfileTab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="max-w-[1500px] mx-auto p-10 space-y-6 min-h-screen">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <SidebarFooter />

      <Separator className="my-6" />

      <div className="flex flex-col lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <ProfileSidebar
            items={PROFILE_SIDEBAR_MENU_ITEMS}
            activeTab={activeTab}
            onChange={setTab}
          />
        </aside>

        <div className="flex-1 lg:max-w-2xl">
          {activeTab === "profile" && <ProfileForm />}
          {activeTab === "two-factor-auth" && <TwoFactorAuth />}
            {activeTab === "forget-password" && <ForgetPassword />}
          {activeTab === "appearance" && <AppearanceSetting />}
          {activeTab === "notifications" && <div>Notification Settings</div>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
