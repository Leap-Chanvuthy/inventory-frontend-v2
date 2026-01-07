import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import ReusableTabs from "@/components/reusable/partials/tabs";
import { breadcrumbItems, tabs } from "./utils/tabs";

export default function Categories() {
  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="my-8 mx-6">
        <h1 className="text-3xl font-bold mb-2">Category Management</h1>
        <p className="text-sm text-muted-foreground">
          Below the inputs, there is an interactive map preview with.
        </p>
      </div>
      <div className="mx-6">
        <ReusableTabs
          name="category-tabs"
          tabs={tabs}
          defaultValue="raw-material-category"
        />
      </div>
    </div>
  );
}
