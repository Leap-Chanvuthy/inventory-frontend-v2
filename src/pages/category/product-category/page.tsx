import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { CategoryList } from "./_components/product-category-list";

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
        <h1 className="text-3xl font-bold mb-2">Product Categories</h1>
        <p className="text-muted-foreground mb-6">
          Manage your product categories
        </p>
        <CategoryList />
      </div>
    </div>
  );
};
