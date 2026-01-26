import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import ReusableTabs from "@/components/reusable/partials/tabs";
import { breadcrumbItems, tabs } from "./utils/data";
import { Text } from "@/components/ui/text/app-text";

export default function Categories() {
  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <div className="mx-6">
        <Text.TitleLarge>Category Management</Text.TitleLarge>
      </div>

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
