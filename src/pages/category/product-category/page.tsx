import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { ProductCategoryList } from "./_components/product-category-list";
import { Text } from "@/components/ui/text/app-text";

export const ProductCategories = () => {
  const breadcrumbItems = [
    { name: "catalogs", label: "Catalogs", link: "/" },
    { name: "product-categories", label: "Product Categories" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="mx-6">
        <Text.TitleLarge className="mb-2">Product Categories</Text.TitleLarge>
        <p className="text-muted-foreground mb-6">
          Manage your product categories
        </p>
        <ProductCategoryList />
      </div>
    </div>
  );
};
