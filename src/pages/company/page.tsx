import { ProfileSidebar } from "@/components/reusable/partials/profile-sidebar";
import { GeneralInfo } from "./company_general_detail/page";
import { AddressInfo } from "./company-address-info/page";
import { TelegramInfo } from "./company-telegram-info/page";
import { BankingInfo } from "./company-banking-info/page";
import { useSearchParams } from "react-router-dom";
import { Building2, MapPin, CreditCard, Bell } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text/app-text";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";

const TAB_LABELS: Record<string, string> = {
  "general-info": "General",
  "address-info": "Address",
  "banking-info": "Banking",
  "notification-info": "Notification",
};

type CompanyTab =
  | "general-info"
  | "address-info"
  | "banking-info"
  | "notification-info";

const COMPANY_SIDEBAR_MENU_ITEMS: {
  title: string;
  tab: CompanyTab;
  icon: React.ReactNode;
}[] = [
  {
    title: "General",
    tab: "general-info",
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    title: "Address",
    tab: "address-info",
    icon: <MapPin className="w-4 h-4" />,
  },
  {
    title: "Banking",
    tab: "banking-info",
    icon: <CreditCard className="w-4 h-4" />,
  },
  {
    title: "Notification",
    tab: "notification-info",
    icon: <Bell className="w-4 h-4" />,
  },
];

const Company = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = (searchParams.get("tab") as CompanyTab) || "general-info";

  const setTab = (tab: CompanyTab) => {
    setSearchParams({ tab });
  };

  const breadcrumbItems = [
    { name: "settings", label: "Settings", link: "" },
    { name: "company", label: "Company", link: "/company" },
    { name: activeTab, label: TAB_LABELS[activeTab] ?? activeTab },
  ];

  return (
    <div className="max-w-full mx-auto px-6 pb-10 space-y-6 min-h-screen">
      <BreadCrumb items={breadcrumbItems} />
      <div className="space-y-0.5">
        <Text.TitleMedium className="tracking-tight">
          Company Settings
        </Text.TitleMedium>
        <p className="text-muted-foreground">
          Manage your company information and preferences.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <ProfileSidebar
            items={COMPANY_SIDEBAR_MENU_ITEMS}
            activeTab={activeTab}
            onChange={setTab}
          />
        </aside>

        <div className="flex-1 lg:max-w-4xl">
          {activeTab === "general-info" && <GeneralInfo />}
          {activeTab === "address-info" && <AddressInfo />}
          {activeTab === "banking-info" && <BankingInfo />}
          {activeTab === "notification-info" && <TelegramInfo />}
        </div>
      </div>
    </div>
  );
};

export default Company;
