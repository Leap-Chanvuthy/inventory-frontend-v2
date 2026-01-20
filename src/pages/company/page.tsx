import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import ReusableTabs from "@/components/reusable/partials/tabs";
import { NotificationInfo } from "./_components/notification-info";
import { GeneralInfo } from "./company_general_detail/page";
import { AddressInfo } from "./company-address-info/page";

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
    content: <NotificationInfo />,
  },
  {
    label: "Notification",
    value: "notification-info",
    content: <NotificationInfo />,
  },
];

const Company = () => {
  return (
    <div>
      <div className="my-4">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <ReusableTabs name="company" tabs={tabs} defaultValue="general-info" />
    </div>
  );
};

export default Company;
