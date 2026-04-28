import { Supplier } from "@/api/suppliers/supplier.types";
import { Warehouse } from "@/api/warehouses/warehouses.types";
import { UOM } from "@/api/uom/uom.types";
import { ProductCategory } from "@/api/categories/types/category.type";

export interface ProductMovement {
  id: number;
  product_id: number;
  product_type: string | null;
  product_status: string;
  quantity: string;
  is_sold: boolean;
  direction: "IN" | "OUT";
  movement_type: string;
  purchase_unit_price_in_usd: number;
  purchase_total_price_in_usd: number;
  purchase_unit_price_in_riel: number;
  purchase_total_price_in_riel: number;
  exchange_rate_from_usd_to_riel: number;
  selling_unit_price_in_usd: number;
  selling_unit_price_in_riel: number;
  selling_exchange_rate_from_usd_to_riel: number;
  movement_date: string;
  note: string | null;
  created_by?: { id: number; name: string; email: string; role: string };
  last_updated_by?: { id: number; name: string; email: string; role: string };
  created_at: string;
  updated_at: string;
}

export interface ProductRawMaterial {
  id: number;
  product_id: number;
  raw_material_id: number;
  quantity_per_unit: string | number;
  scrap_percentage?: string | number;
  // Legacy fallback from older API responses.
  quantity?: string | number;
  created_at: string;
  updated_at: string;
  raw_material?: {
    id: number;
    material_name: string;
    material_sku_code: string;
    base_uom_id: number;
    uom_name?: string;
    uom?: UOM;
  };
}

export interface Product {
  id: number;
  product_name: string;
  product_sku_code: string;
  barcode: string | null;
  product_description: string | null;
  product_type: "INTERNAL_PRODUCED" | "EXTERNAL_PURCHASED" | string;
  sale_method?: "FIFO" | "LIFO" | string;
  product_category_id: number;
  supplier_id: number | null;
  warehouse_id: number;
  base_uom_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Flattened relation fields
  product_category_name: string;
  official_name?: string;
  warehouse_name?: string;
  uom_name?: string;
  latest_selling_unit_price_in_usd?: number;
  latest_selling_unit_price_in_riel?: number;
  latest_selling_exchange_rate_from_usd_to_riel?: number;
  latest_selling_exchange_rate_from_riel_to_usd?: number;
  // Nested relations
  category?: ProductCategory;
  supplier?: Supplier | null;
  warehouse?: Omit<Warehouse, "images">;
  uom?: UOM;
  base_uom?: UOM & { category?: { id: number; name: string; unit_of_measurements?: UOM[] } };
  product_movements?: ProductMovement[];
  product_images?: { id: number; image: string }[];
  product_raw_materials?: ProductRawMaterial[];
}

export interface ProductPnL {
  revenue_usd: number;
  revenue_riel: number;
  costs: {
    purchase: { count: number; total_usd: number; total_riel: number };
    reorder: { count: number; total_usd: number; total_riel: number };
    scrap: { count: number; total_usd: number; total_riel: number };
    sales: { count: number; revenue_usd: number; revenue_riel: number; cogs_usd: number; cogs_riel: number };
  };
  total_loss_usd: number;
  total_loss_riel: number;
  gross_profit_usd: number;
  gross_profit_riel: number;
  net_profit_usd: number;
  net_profit_riel: number;
  counts: {
    total_movements: number;
    by_type: Record<string, number>;
  };
}

export interface GetProductDetailData {
  is_sold: boolean;
  allow_bom_update?: boolean;
  product: Product;
  current_qty_in_stock: number;
  product_stock_status: string;
  total_count_by_movement_type: Record<string, number>;
  product_pnl: ProductPnL;
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
  data: GetProductDetailData;
}

export interface ProductQueryParams {
  page?: number;
  per_page?: number;
  "filter[search]"?: string;
  "filter[product_type]"?: string;
  "filter[product_category_id]"?: number;
  "filter[supplier_id]"?: number;
  "filter[warehouse_id]"?: number;
  "filter[uom_id]"?: number;
  sort?: string;
}

export interface ProductMovementQueryParams {
  page?: number;
  per_page?: number;
  sort?: string;
  "filter[movement_type]"?: string;
  "filter[direction]"?: string;
}

export type GetProductMovementsResponse = PaginatedData<ProductMovement>;

// External Purchase creation
export interface CreateExternalPurchaseRequest {
  product_name: string;
  product_description?: string;
  product_category_id: number;
  base_uom_id: number;
  supplier_id: number;
  warehouse_id: number;
  quantity: number;
  purchase_unit_price_in_usd: number;
  exchange_rate_from_usd_to_riel: number;
  selling_unit_price_in_usd: number;
  selling_exchange_rate_from_usd_to_riel: number;
  movement_date?: string;
  note?: string;
  sale_method: "FIFO" | "LIFO" | string;
}

// Internal Manufacturing creation
export interface RawMaterialBOM {
  raw_material_id: number;
  quantity_per_unit: number;
  scrap_percentage?: number;
}

export interface CreateInternalManufacturingRequest {
  product_name: string;
  product_description?: string;
  product_category_id: number;
  base_uom_id: number;
  warehouse_id: number;
  product_status: string;
  quantity: number;
  selling_unit_price_in_usd: number;
  selling_exchange_rate_from_usd_to_riel: number;
  movement_date?: string;
  note?: string;
  raw_materials: RawMaterialBOM[];
  sale_method: "FIFO" | "LIFO" | string;
}

export interface ReorderInternalManufacturingPayload {
  movement_date: string;
  product_status: string;
  quantity: number;
  selling_unit_price_in_usd: number;
  selling_exchange_rate_from_usd_to_riel: number;
  raw_materials?: {
    raw_material_id: number;
    quantity_per_unit: number;
    scrap_percentage?: number;
  }[];
  bom_override?: {
    raw_material_id: number;
    scrap_percentage: number;
  }[];
  note?: string;
}

export interface ReorderExternalPurchasePayload {
  movement_date: string;
  quantity: number;
  purchase_unit_price_in_usd: number;
  exchange_rate_from_usd_to_riel: number;
  selling_unit_price_in_usd: number;
  selling_exchange_rate_from_usd_to_riel: number;
  note?: string;
}

export interface CreateProductRequest {
  product_name: string;
  product_description?: string;
  barcode?: string;
  product_category_id: number;
  uom_id: number;
  supplier_id: number;
  warehouse_id: number;
  sale_method?: "FIFO" | "LIFO" | string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface CreateScrapMovementPayload {
  movement_date: string;
  quantity: number;
  note?: string;
}

export interface UpdateScrapMovementPayload {
  movement_date?: string;
  quantity?: number;
  note?: string;
}

export interface ScrapMovement {
  id: number;
  product_id: number;
  product_type: string | null;
  direction: "OUT";
  movement_type: "SCRAP";
  product_status: string;
  quantity: number;
  is_sold: boolean;
  movement_date: string;
  note: string | null;
  created_by: number;
  last_updated_by: number;
  purchase_unit_price_in_usd: number;
  purchase_total_price_in_usd: number;
  exchange_rate_from_usd_to_riel: number;
  exchange_rate_from_riel_to_usd: number;
  purchase_unit_price_in_riel: number;
  purchase_total_price_in_riel: number;
  selling_unit_price_in_usd: number;
  selling_unit_price_in_riel: number;
  selling_exchange_rate_from_usd_to_riel: number;
  selling_exchange_rate_from_riel_to_usd: number;
  created_at: string;
  updated_at: string;
}

export interface ScrapMovementResponse {
  status: boolean;
  message: string;
  data: {
    product: Product;
    movement: ScrapMovement;
  };
}

export interface ScrapMovementMutationResponse {
  status: boolean;
  message: string;
  data: ScrapMovement;
}

export interface GetMovementDetailResponse {
  status: boolean;
  message: string;
  data: {
    movement: ProductMovement;
    product_reorder?: {
      bom_items?: Array<{
        raw_material_id: number;
        quantity_per_unit?: number;
        quantity?: number;
        scrap_percentage?: number;
        raw_material?: {
          material_name?: string;
          uom_name?: string;
          uom?: { name?: string; symbol?: string };
        };
      }>;
    };
  };
}

export interface InsufficientStockError {
  raw_material_id: number;
  material_name: string;
  material_sku_code: string;
  required_qty: number;
  available_qty: number;
  shortfall_qty: number;
}

export interface ProductValidationErrors {
  status: boolean;
  message: string;
  errors?: Record<string, string[]> | InsufficientStockError[];
}
