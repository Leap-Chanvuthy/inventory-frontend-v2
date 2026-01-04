import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import ReusableTabs from "@/components/reusable/partials/tabs";
import { breadcrumbItems, tabs } from "./data/data";

export default function Categories() {
  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <div className="mx-6">
        <ReusableTabs
          name="category-tabs"
          tabs={tabs}
          defaultValue="raw-material"
        />
      </div>
    </div>
  );
}
