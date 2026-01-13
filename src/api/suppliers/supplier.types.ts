// Supplier Category Enum (common values)
export enum SupplierCategory {
  PRODUCTS = "PRODUCTS",
  FOOD = "FOOD",
  CLOTHING = "CLOTHING",
  LOGISTICS = "LOGISTICS",
  OTHERS = "OTHERS",
}

// Bank Account Information
export interface SupplierBank {
  id: number;
  supplier_id: number;
  bank_name: string;
  account_number: string;
  account_holder_name: string;
  payment_link: string | null;
  qr_code_image: string | null;
  bank_label: string;
  created_at: string;
  updated_at: string;
}

// Supplier Information
export interface Supplier {
  id: number;
  official_name: string;
  supplier_code: string;
  contact_person: string;
  phone: string;
  email: string;
  image: string | null;
  legal_business_name: string;
  tax_identification_number: string;
  business_registration_number: string;
  supplier_category: string; // Can be enum values or custom strings like "Raw Material"
  business_description: string;
  address_line1: string;
  address_line2: string;
  village: string;
  commune: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
  latitude: string | number;
  longitude: string | number;
  banks_count?: number; // Optional field present in create/update responses
  created_at: string;
  updated_at: string;
  banks: SupplierBank[];
}

// Pagination Link
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Paginated Response Data
export interface SupplierPaginatedData {
  current_page: number;
  data: Supplier[];
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
export interface GetSuppliersResponse {
  status: boolean;
  message: string;
  data: SupplierPaginatedData;
}

// Single Supplier Response (for GET by ID, POST, PUT)
export interface GetSupplierResponse {
  status: boolean;
  message: string;
  data: Supplier;
}

// Create/Update Supplier Request
export interface CreateSupplierRequest {
  official_name: string;
  contact_person: string;
  phone: string;
  email: string;
  image?: string | null;
  legal_business_name: string;
  tax_identification_number: string;
  business_registration_number: string;
  supplier_category: string; // Can be enum values or custom strings
  business_description: string;
  address_line1: string;
  address_line2?: string;
  village: string;
  commune: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
  latitude: string | number;
  longitude: string | number;
  banks?: Array<{
    bank_name: string;
    account_number: string;
    account_holder_name: string;
    payment_link?: string | null;
    qr_code_image?: string | null;
    bank_label?: string;
  }>;
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {
  id: number;
}

// Query Parameters
export interface SupplierQueryParams {
  page?: number;
  per_page?: number;
  "filter[id]"?: number;
  "filter[search]"?: string;
  sort?: string;
}

export interface ValidationErrors {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}
export interface BankDetails {
  bank_name: string;
  account_number: string;
  account_holder_name: string;
  payment_link: string;
  qr_code_image: File | null;
  existing_qr_code?: string; // For update form - URL of existing QR code image
}

export interface CreateSupplierFormPayload {
  official_name: string;
  contact_person: string;
  phone: string;
  email: string;
  legal_business_name: string;
  tax_identification_number: string;
  business_registration_number: string;
  supplier_category: string;
  business_description: string;
  address_line1: string;
  address_line2: string;
  village: string;
  commune: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
  latitude: string;
  longitude: string;
  image: File | null;
  banks: BankDetails[];
}
