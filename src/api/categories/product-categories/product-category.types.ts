// Product Category
export interface ProductCategory {
  id: number;
  category_name: string;
  label_color: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Paginated Response
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
export interface ProductCategoryResponse<T> {
  status: boolean;
  message: string;
  data: PaginatedResponse<T>;
}

// Query Parameters
export interface ProductCategoryQueryParams {
  page?: number;
  per_page?: number;
  "filter[search]"?: string;
  sort?: string;
}

// Create Product Category Request
export interface CreateProductCategoryRequest {
  category_name: string;
  label_color: string;
  description: string;
}

// Validation Errors
export interface CreateProductCategoryValidationErrors {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}
