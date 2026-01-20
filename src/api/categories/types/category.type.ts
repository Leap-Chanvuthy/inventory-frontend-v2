// Base Category Interface
export interface BaseCategory {
  id: number;
  category_name: string;
  label_color: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Specific Category Types
export interface RawMaterialCategory extends BaseCategory {}
export interface ProductCategory extends BaseCategory {}
export interface CustomerCategory extends BaseCategory {}

// Pagination Types
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// API Response
export interface CategoryResponse<T> {
  status: boolean;
  message: string;
  data: PaginatedResponse<T>;
}

// Query Parameters
export interface CategoryQueryParams {
  page?: number;
  per_page?: number;
  "filter[search]"?: string;
  sort?: string;
}

// Create Category Request
export interface CreateCategoryRequest {
  category_name: string;
  label_color: string;
  description: string;
}

// Validation Errors
export interface CreateCategoryValidationErrors {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// Typed Aliases for specific categories
export type RawMaterialCategoryResponse = CategoryResponse<RawMaterialCategory>;
export type ProductCategoryResponse = CategoryResponse<ProductCategory>;
export type CustomerCategoryResponse = CategoryResponse<CustomerCategory>;

export type RawMaterialCategoryQueryParams = CategoryQueryParams;
export type ProductCategoryQueryParams = CategoryQueryParams;
export type CustomerCategoryQueryParams = CategoryQueryParams;

export type CreateRawMaterialCategoryRequest = CreateCategoryRequest;
export type CreateProductCategoryRequest = CreateCategoryRequest;
export type CreateCustomerCategoryRequest = CreateCategoryRequest;

export type CreateRawMaterialCategoryValidationErrors = CreateCategoryValidationErrors;
export type CreateProductCategoryValidationErrors = CreateCategoryValidationErrors;
export type CreateCustomerCategoryValidationErrors = CreateCategoryValidationErrors;
