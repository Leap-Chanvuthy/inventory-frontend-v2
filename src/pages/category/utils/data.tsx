import { RawMaterialCategoryList } from "../raw-material-category/_components/raw-material-category-list";
import { ProductCategoryList } from "../product-category/_components/product-category-list";
import { CustomerCategoryList } from "../customer-category/_components/customer-category-list";

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
    value: "product-category",
    content: <ProductCategoryList />,
  },
  {
    label: "Customer Category",
    value: "customer-category",
    content: <CustomerCategoryList />,
  },
];
