import { BreadCrumb } from "@/components/reusable/partials/breadcrumb"
import ReusableTabs from "@/components/reusable/partials/tabs"
import { GeneralInfo } from "./_components/general-info"

const breadcrumbItems = [
  { name: "settings", label: "Settings", link: "/settings" },
  { name: "company", label: "Company" },
]

  const tabs = [
    {
      label: "General Information",
      value: "general-info",
      content: <GeneralInfo />,
    },
    {
      label: "Address Information",
      value: "address-info",
      content: <div>Company Address Content</div>,
    },
    // {
    //   label: "Banking Information",
    //   value: "banking-info",
    //   content: <div>Company Banking Content</div>,
    // },
    //     {
    //   label: "Telegram Notification",
    //   value: "telegram-notification",
    //   content: <div>Company Telegram Notification Content</div>,
    // },
  ]

const Company = () => {
  return (
    <div>
        <div className="my-4">
            <BreadCrumb items={breadcrumbItems} />
        </div>
        <ReusableTabs name="company" tabs={tabs} defaultValue="general-info" />


    </div>
  )
}

export default Company
