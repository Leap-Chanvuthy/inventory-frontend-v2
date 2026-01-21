import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import ReusableTabs from "@/components/reusable/partials/tabs";
import { GeneralInfo } from "./company_general_detail/page";
import { AddressInfo } from "./company-address-info/page";
import { TelegramInfo } from "./company-telegram-info/page";

const breadcrumbItems = [
  { name: "settings", label: "Settings", link: "/settings" },
  { name: "company", label: "Company Information" },
];

const tabs = [
  {
    label: "General",
    value: "general-info",
    content: <GeneralInfo />,
  },
  {
    label: "Address",
    value: "address-info",
    content: <AddressInfo />,
  },
  {
    label: "Banking",
    value: "banking-info",
    content: <div>Banking</div>,
  },
  {
    label: "Notification",
    value: "notification-info",
    content: <TelegramInfo />,
  },
];

const Company = () => {
  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="mx-6">
        <ReusableTabs name="company" tabs={tabs} defaultValue="general-info" />
      </div>
    </div>
  );
};

export default Company;
