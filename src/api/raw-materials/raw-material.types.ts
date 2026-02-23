import { Supplier } from "../suppliers/supplier.types";
import { Warehouse } from "../warehouses/warehouses.types";
import { UOM } from "../uom/uom.types";
import { RawMaterialCategory } from "../categories/types/category.type";
import { User } from "../users/user.types";

// Stock Movement Types
export interface RawMaterialStockMovement {
  id: number;
  raw_material_id: number;
  quantity: number;
  in_used?: boolean;
  direction: "IN" | "OUT";
  movement_type:
    | "PURCHASE"
    | "PRODUCTION_SCRAP"
    | "ADJUSTMENT_IN"
    | "ADJUSTMENT_OUT"
    | "RE_ORDER";
  unit_price_in_usd: number;
  total_value_in_usd: number;
  exchange_rate_from_usd_to_riel: number;
  unit_price_in_riel: number;
  total_value_in_riel: number;
  exchange_rate_from_riel_to_usd: number;
  movement_date: string;
  created_by?: User;
  last_updated_by?: User;
  note: string | null;
  created_at: string;
  updated_at: string;
}

// Raw Material Image
export interface RawMaterialImage {
  id: number;
  raw_material_id: number;
  image: string;
  created_at: string;
  updated_at: string;
}

// Raw Material Entity
export interface RawMaterial {
  id: number;
  material_name: string;
  material_sku_code: string;
  barcode: string | null;
  minimum_stock_level: number;
  expiry_date: string | null;
  description: string | null;
  raw_material_category_id: number;
  uom_id: number;
  supplier_id: number;
  warehouse_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Flattened fields from relations (for list view)
  raw_material_category_name: string;
  official_name?: string; // Supplier official name
  warehouse_name?: string;
  uom_name?: string;
  // Nested relations
  rm_category?: RawMaterialCategory;
  supplier?: Supplier;
  warehouse?: Omit<Warehouse, "images">;
  production_method: string;
  uom?: UOM;
  // Detail view relations
  rm_stock_movements?: RawMaterialStockMovement[];
  rm_images?: RawMaterialImage[];
}

// Pagination Types
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedData<T> {
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

// API Responses
export type GetRawMaterialsResponse = PaginatedData<RawMaterial>;

export interface GetRawMaterialResponse {
  status: boolean;
  message: string;
  data: {
    raw_material: RawMaterial;
    current_qty_in_stock: number;
    raw_material_status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
    total_count_by_movement_type: Record<string, number>;
  };
}

// Query Parameters
export interface RawMaterialQueryParams {
  page?: number;
  per_page?: number;
  "filter[search]"?: string;
  "filter[raw_material_category_id]"?: number;
  "filter[uom_id]"?: number;
  "filter[supplier_id]"?: number;
  "filter[warehouse_id]"?: number;
  sort?: string;
}

// Create/Update Request
export interface CreateRawMaterialRequest {
  material_name: string;
  minimum_stock_level: number;
  expiry_date: string;
  description?: string;
  raw_material_category_id: number;
  uom_id: number;
  supplier_id: number;
  warehouse_id: number;
  production_method: string;
  // Initial stock movement fields
  quantity: number | null;
  unit_price_in_usd: number | null;
  exchange_rate_from_usd_to_riel: number | null;
  note?: string;
  // Images
  image?: File;
  images?: File[];
}

// Create Response
export interface CreateRawMaterialResponse {
  status: boolean;
  message: string;
  data: {
    raw_material: RawMaterial;
  };
}

export interface UpdateRawMaterialRequest extends Partial<CreateRawMaterialRequest> {
  id: number;
}

// Reorder Raw Material
export interface ReorderRawMaterialPayload {
  quantity: number;
  unit_price_in_usd: number;
  exchange_rate_from_usd_to_riel: number;
  movement_date: string;
  note?: string;
}
export interface ReorderRawMaterialResponse {
  status: boolean;
  message: string;
  data: RawMaterialStockMovement;
}

// Validation Errors
export interface RawMaterialValidationErrors {
  status: boolean;
  message: string;
  errors?: {
    material_name?: string[];
    barcode?: string[];
    minimum_stock_level?: string[];
    expiry_date?: string[];
    description?: string[];
    raw_material_category_id?: string[];
    uom_id?: string[];
    supplier_id?: string[];
    warehouse_id?: string[];
    production_method?: string[];
    quantity?: string[];
    unit_price_in_usd?: string[];
    total_value_in_usd?: string[];
    exchange_rate_from_usd_to_riel?: string[];
    total_value_in_riel?: string[];
    note?: string[];
  };
}
