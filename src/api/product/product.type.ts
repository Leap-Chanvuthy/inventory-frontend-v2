import { Supplier } from "@/api/suppliers/supplier.types";
import { Warehouse } from "@/api/warehouses/warehouses.types";
import { UOM } from "@/api/uom/uom.types";
import { ProductCategory } from "@/api/categories/types/category.type";

export interface Product {
  id: number;
  product_name: string;
  product_sku_code: string;
  barcode: string | null;
  product_description: string | null;
  product_category_id: number;
  uom_id: number;
  supplier_id: number;
  warehouse_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Flattened relation fields
  product_category_name: string;
  official_name?: string;
  warehouse_name?: string;
  uom_name?: string;
  // Nested relations
  category?: ProductCategory;
  supplier?: Supplier;
  warehouse?: Omit<Warehouse, "images">;
  uom?: UOM;
}

export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: { url: string | null; label: string; active: boolean }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export type GetProductsResponse = PaginatedData<Product>;

export interface GetProductResponse {
  status: boolean;
  message: string;
  data: {
    product: Product;
  };
}

export interface ProductQueryParams {
  page?: number;
  per_page?: number;
  "filter[search]"?: string;
  "filter[product_category_id]"?: number;
  "filter[supplier_id]"?: number;
  "filter[warehouse_id]"?: number;
  "filter[uom_id]"?: number;
  sort?: string;
}

export interface CreateProductRequest {
  product_name: string;
  product_description?: string;
  barcode?: string;
  product_category_id: number;
  uom_id: number;
  supplier_id: number;
  warehouse_id: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface ProductValidationErrors {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}
