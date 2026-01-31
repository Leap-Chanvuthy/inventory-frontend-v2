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
  "filter[supplier_category]"?:string;
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

// User Information (for import history uploader)
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Import History Record
export interface ImportHistoryRecord {
  id: number;
  filename: string;
  size: string;
  uploaded_by: number;
  total_uploaded: number;
  uploaded_at: string;
  user: User;
}

// Import History Paginated Data
export interface ImportHistoryPaginatedData {
  current_page: number;
  data: ImportHistoryRecord[];
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

// Import History Response
export interface GetImportHistoriesResponse {
  status: boolean;
  message: string;
  data: ImportHistoryPaginatedData;
}

// Import History Query Parameters
export interface ImportHistoryQueryParams {
  page?: number;
  per_page?: number;
  "filter[id]"?: number;
  "filter[search]"?: string;
  sort?: string;
}

// Supplier Statistics Types
export interface TrendData {
  delta: number;
  percent: number;
  direction: "up" | "down";
}

export interface NewSuppliersData {
  this_month: number;
  last_month: number;
  trend: TrendData;
}

export interface TotalByCategoryData {
  ELECTRONICS?: number;
  FOOD?: number;
  CLOTHING?: number;
  LOGISTICS?: number;
  SERVICES?: number;
  PRODUCTS?: number;
  OTHERS?: number;
  [key: string]: number | undefined; // Allow dynamic category keys
}

export interface ImportData {
  total_histories: number;
  total_uploaded_rows: number;
  total_files_size_bytes: number;
  average_file_size_bytes: number;
  largest_file_size_bytes: number;
  recent: ImportHistoryRecord[];
}

export interface MonthlySupplierData {
  month: string;
  total: number;
}

export interface MonthlyImportData {
  month: string;
  total_imports: number;
  total_uploaded: number;
  total_size_bytes: number;
}

export interface ProvinceData {
  province: string;
  total: number;
}

export interface SupplierCharts {
  suppliers_created_by_month: MonthlySupplierData[];
  imports_by_month: MonthlyImportData[];
  top_provinces: ProvinceData[];
}

export interface SupplierStatisticsData {
  total_suppliers: number;
  total_suppliers_as_of_end_last_month: number;
  total_suppliers_trend: TrendData;
  new_suppliers: NewSuppliersData;
  total_by_category: TotalByCategoryData;
  imports: ImportData;
  charts: SupplierCharts;
}

export interface GetSupplierStatisticsResponse {
  status: boolean;
  message: string;
  data: SupplierStatisticsData;
}
