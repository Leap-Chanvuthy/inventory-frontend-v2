// Customer Status Enum
export enum CustomerStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PROSPECTIVE = "PROSPECTIVE",
}

// Customer Category Information
export interface CustomerCategory {
  id: number;
  category_name: string;
  label_color: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Customer Information
export interface Customer {
  id: number;
  customer_code: string;
  image: string | null;
  fullname: string;
  email_address: string;
  phone_number: string;
  social_media: string | null;
  customer_address: string | null;
  google_map_link: string | null;
  customer_status: CustomerStatus;
  customer_category_id: number;
  customer_category_name: string;
  customer_category: CustomerCategory;
  customer_note: string | null;
  created_at: string;
  updated_at: string;
}

// Pagination Link
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Paginated Response Data
export interface CustomerPaginatedData {
  current_page: number;
  data: Customer[];
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
export interface GetCustomersResponse {
  status: boolean;
  message: string;
  data: CustomerPaginatedData;
}

// Single Customer Response (for GET by ID, POST, PUT)
export interface GetCustomerResponse {
  status: boolean;
  message: string;
  data: Customer;
}

// Create/Update Customer Request
export interface CreateCustomerRequest {
  customer_code?: string;
  image?: File | string | null;
  fullname: string;
  email_address: string;
  phone_number: string;
  social_media?: string | null;
  customer_address?: string | null;
  google_map_link?: string | null;
  customer_status: CustomerStatus;
  customer_category_id: number;
  customer_note?: string | null;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  id: number;
}

// Query Parameters
export interface CustomerQueryParams {
  page?: number;
  per_page?: number;
  "filter[id]"?: number;
  "filter[search]"?: string;
  "filter[customer_status]"?: string;
  "filter[customer_category]"?: string;
  sort?: string;
}

export interface ValidationErrors {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export interface CreateCustomerFormPayload {
  customer_code?: string;
  image: File | null;
  existing_image?: string; // For update form - URL of existing image
  fullname: string;
  email_address: string;
  phone_number: string;
  social_media: string;
  customer_address: string;
  google_map_link: string;
  customer_status: CustomerStatus;
  customer_category_id: number;
  customer_note: string;
}
