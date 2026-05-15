import { Supplier } from "../suppliers/supplier.types";
import { Warehouse } from "../warehouses/warehouses.types";
import { UOM } from "../uom/uom.types";
import { RawMaterialCategory } from "../categories/types/category.type";
import { User } from "../users/user.types";

// Stock Movement Types
export interface RawMaterialStockMovement {
  id: number;
  raw_material_id: number;
  source_movement_id?: number | null;
  quantity: number;
  remaining_quantity?: number;
  in_used?: boolean;
  direction: "IN" | "OUT";
  movement_type:
    | "PURCHASE"
    | "PRODUCTION_SCRAP"
    | "SCRAP"
    | "MANUFACTURING"
    | "PRODUCTION_RECEIPT"
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
  expiry_date: string | null;
  created_by?: User;
  last_updated_by?: User;
  note: string | null;
  created_at: string;
  updated_at: string;
  uom_name?: string;
  uom_symbol?: string;
}

export interface RawMaterialStockLotChild {
  id: number;
  type: string;
  reference?: string | null;
  quantity: number;
  date: string | null;
  reason?: string | null;
  product_id?: number | null;
  product_name?: string | null;
  product_movement_id?: number | null;
  unit_cost_usd?: number;
  line_cost_usd?: number;
}

export interface RawMaterialStockLot {
  id: number;
  batch_code: string;
  movement_type: string;
  movement_date: string | null;
  expiry_date: string | null;
  is_expired: boolean;
  days_until_expiry?: number | null;
  quantity: number;
  remaining_quantity: number;
  used_in_production_quantity: number;
  scrapped_quantity: number;
  available_quantity: number;
  unit_cost_usd: number;
  unit_cost_riel?: number;
  status: string;
  can_use_for_production: boolean;
  can_scrap: boolean;
  disabled_reason?: string | null;
  children: RawMaterialStockLotChild[];
}

export interface RawMaterialStockLotSummary {
  available_quantity: number;
  expired_quantity: number;
  scrapped_quantity: number;
  used_in_production_quantity: number;
  production_method: "FIFO" | "LIFO" | string;
  total_batches: number;
}

export interface UomHierarchyQuantity {
  uom_id: number;
  uom_name: string;
  uom_symbol?: string | null;
  conversion_factor: number;
  equivalent_quantity: number;
  is_base_uom: boolean;
}

export interface StockMovementsQueryParams {
  page?: number;
  per_page?: number;
  "filter[movement_type]"?: string;
  "filter[direction]"?: string;
  sort?: string;
}

export interface PaginatedStockMovementsResponse {
  current_page: number;
  data: RawMaterialStockMovement[];
  last_page: number;
  total: number;
  per_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
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
  base_uom_id: number;
  supplier_id: number;
  warehouse_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Flattened fields from relations (for list view)
  raw_material_category_name: string;
  official_name?: string; // Supplier official name
  warehouse_name?: string;
  current_qty_in_stock?: number;
  stock_availability?: number;
  stock_availability_status?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
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
    raw_material_status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "EXPIRED";
    total_count_by_movement_type: Record<string, number>;
    stock_lot_summary: RawMaterialStockLotSummary;
    stock_lots: RawMaterialStockLot[];
    uom_hierarchy_quantities: UomHierarchyQuantity[];
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
  base_uom_id: number;
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

export interface UpdateRawMaterialRequest {
  material_name: string;
  production_method?: string;
  barcode?: string;
  images?: File[];
  minimum_stock_level: number;
  expiry_date: string;
  description?: string;
  raw_material_category_id: number;
  base_uom_id: number;
  supplier_id: number;
  warehouse_id: number;
  quantity: number | null;
  unit_price_in_usd: number | null;
  exchange_rate_from_usd_to_riel: number | null;
  movement_date: string;
  note?: string;
}

// Reorder Raw Material
export interface ReorderRawMaterialPayload {
  quantity: number;
  unit_price_in_usd: number;
  exchange_rate_from_usd_to_riel: number;
  movement_date: string;
  expiry_date: string;
  note?: string;
}
export interface ReorderRawMaterialResponse {
  status: boolean;
  message: string;
  data: RawMaterialStockMovement;
}

export interface RawMaterialStockLotsResponse {
  status: boolean;
  message: string;
  data: {
    stock_lot_summary: RawMaterialStockLotSummary;
    stock_lots: RawMaterialStockLot[];
  };
}

export interface RawMaterialAllocationPreviewResponse {
  status: boolean;
  message: string;
  data: {
    raw_material_id: number;
    material_name: string;
    production_method: "FIFO" | "LIFO" | string;
    requested_quantity: number;
    available_quantity: number;
    can_fulfill: boolean;
    lots: Array<{
      source_movement_id: number;
      movement_type: string;
      movement_date: string | null;
      expiry_date: string | null;
      allocated_quantity: number;
      remaining_before: number;
      remaining_after: number;
      unit_cost_usd: number;
      unit_cost_riel: number;
      line_cost_usd: number;
      line_cost_riel: number;
    }>;
    message?: string | null;
  };
}

export interface CreateRawMaterialScrapPayload {
  source_movement_id: number;
  quantity: number;
  movement_date?: string;
  reason?: string;
  note?: string;
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
    base_uom_id?: string[];
    supplier_id?: string[];
    warehouse_id?: string[];
    production_method?: string[];
    movement_date?: string[];
    quantity?: string[];
    unit_price_in_usd?: string[];
    total_value_in_usd?: string[];
    exchange_rate_from_usd_to_riel?: string[];
    total_value_in_riel?: string[];
    note?: string[];
  };
}
