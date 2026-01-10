import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import ReusableTabs from "@/components/reusable/partials/tabs";
import { breadcrumbItems, tabs } from "./utils/data";

export default function Categories() {
  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <h1 className="text-3xl font-bold  mx-6">Category Management</h1>

      <div className="mx-6 mt-8">
        <ReusableTabs
          name="category-tabs"
          tabs={tabs}
          defaultValue="raw-material-category"
        />
      </div>
    </div>
  );
}

{
  /* <p className="text-sm text-muted-foreground">
          Below the inputs, there is an interactive map preview with.
        </p> */
}
