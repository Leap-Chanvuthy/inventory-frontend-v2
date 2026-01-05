import { CategoryList } from "../_components/category-list";

export const breadcrumbItems = [
  { name: "catalog", label: "Catalog", link: "" },
  { name: "category", label: "Category", link: "/category" },
  { name: "list", label: "List of Categories" },
];

export const tabs = [
  {
    label: "Raw Material Category",
    value: "raw-material-category",
    content: <CategoryList />,
  },
  {
    label: "Product Category",
    value: "product-category",
    content: (
      <div className="p-6 text-center text-muted-foreground">
        Product Category - Coming soon
      </div>
    ),
  },
  {
    label: "Customer Category",
    value: "customer-category",
    content: (
      <div className="p-6 text-center text-muted-foreground">
        Customer Category - Coming soon
      </div>
    ),
  },
];
