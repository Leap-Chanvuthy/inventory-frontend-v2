import { CategoryList as RawMaterialCategoryList } from "../raw-material-category/_components/raw-material-category-list";
import { CategoryList as ProductCategoryList } from "../product-category/_components/product-category-list";

export const breadcrumbItems = [
  { name: "application", label: "Application", link: "/" },
  { name: "category", label: "Category", link: "/category" },
  { name: "list", label: "List of Categories" },
];

export const tabs = [
  {
    label: "Raw Material Category",
    value: "raw-material-category",
    content: <RawMaterialCategoryList />,
  },
  {
    label: "Product Category",
    value: "product",
    content: <ProductCategoryList />,
  },
  {
    label: "Customer Category",
    value: "customer",
    content: (
      <div className="p-6 text-center text-muted-foreground">
        Customer Category - Coming soon
      </div>
    ),
  },
];
