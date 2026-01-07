import { CategoryList } from "../_components/category-list";

export const breadcrumbItems = [
  { name: "application", label: "Application", link: "/" },
  { name: "category", label: "Category", link: "/categories" },
  { name: "list", label: "List of Raw Material Category" },
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
