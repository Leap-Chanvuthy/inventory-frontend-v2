import { CategoryList } from "../_components/category-list";

export const breadcrumbItems = [
  { name: "catalog", label: "Catalog", link: "" },
  { name: "category", label: "Category", link: "/category" },
  { name: "list", label: "List of Categories" },
];

export const tabs = [
  {
    label: "Raw Material Category",
    value: "raw-material",
    content: <CategoryList />,
  },
  {
    label: "Product Category",
    value: "product",
    content: <CategoryList/>
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
