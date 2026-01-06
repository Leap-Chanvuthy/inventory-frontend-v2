// Raw Material Category
export interface RawMaterialCategory {
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
