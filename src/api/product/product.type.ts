import { Supplier } from "@/api/suppliers/supplier.types";
import { Warehouse } from "@/api/warehouses/warehouses.types";
import { UOM } from "@/api/uom/uom.types";
import { ProductCategory } from "@/api/categories/types/category.type";

export interface ProductMovement {
  id: number;
  product_id: number;
  product_type: string | null;
  product_status: string;
  quantity: string | number;
  remaining_quantity?: string | number;
  is_sold: boolean;
  direction: "IN" | "OUT";
  movement_type: string;
  purchase_unit_price_in_usd: number;
  purchase_total_price_in_usd: number;
  purchase_unit_price_in_riel: number;
  purchase_total_price_in_riel: number;
  exchange_rate_from_usd_to_riel: number;
  exchange_rate_from_riel_to_usd?: number;
  selling_unit_price_in_usd: number;
  selling_unit_price_in_riel: number;
  selling_exchange_rate_from_usd_to_riel: number;
  selling_exchange_rate_from_riel_to_usd?: number;
  movement_date: string;
  expiry_date?: string | null;
  note: string | null;
  created_by?: number | { id: number; name: string; email: string; role: string };
  last_updated_by?: number | { id: number; name: string; email: string; role: string };
  created_at: string;
  updated_at: string;
}

export type StockLotStatus = "AVAILABLE" | "PARTIALLY_CONSUMED" | "CONSUMED";

export interface ProductStockLotChild {
  id: number;
  type: string;
  reference?: string | null;
  quantity: number;
  date: string | null;
  unit_price?: number;
  total?: number;
  reason?: string | null;
  customer_id?: number | null;
  customer_name?: string | null;
  sale_order_id?: number | null;
  sale_order_number?: string | null;
  related_raw_materials?: Array<{
    raw_material_id: number;
    raw_material_name?: string | null;
  }>;
}

export interface ProductStockLot {
  id: number;
  batch_code?: string;
  movement_type: string;
  direction?: "IN" | "OUT";
  movement_date?: string | null;
  expiry_date?: string | null;
  is_expired?: boolean;
  days_until_expiry?: number | null;
  product_status?: string | null;
  quantity: number;
  remaining_quantity: number;
  allocated_quantity?: number;
  sold_quantity?: number;
  scrapped_quantity?: number;
  adjusted_out_quantity?: number;
  available_quantity?: number;
  lot_status?: StockLotStatus;
  status?: "AVAILABLE" | "PARTIALLY_USED" | "FULLY_USED" | "EXPIRED" | "LOCKED" | string;
  selling_unit_price_in_usd: number;
  selling_unit_price_in_riel?: number;
  purchase_unit_price_in_usd?: number;
  purchase_unit_price_in_riel?: number;
  can_sale?: boolean;
  can_scrap?: boolean;
  disabled_reason?: string | null;
  children?: ProductStockLotChild[];
}

export interface ProductStockLotSummary {
  available_quantity: number;
  expired_quantity: number;
  total_original_quantity: number;
  total_sold_quantity: number;
  total_scrapped_quantity: number;
  total_remaining_quantity: number;
  sale_method: "FIFO" | "LIFO" | string;
}

export interface ProductStockLotsPayload {
  stock_lot_summary: ProductStockLotSummary;
  stock_lots: ProductStockLot[];
}

export interface ProductRawMaterial {
  id: number;
  product_id: number;
  raw_material_id: number;
  quantity_per_unit: string | number;
  scrap_percentage?: string | number;
  quantity?: string | number;
  created_at: string;
  updated_at: string;
  raw_material?: {
    id: number;
    material_name: string;
    material_sku_code: string;
    base_uom_id: number;
    current_qty_in_stock?: number;
    stock_availability?: number;
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
  current_qty_in_stock?: number;
  // Nested relations
  category?: ProductCategory;
  supplier?: Supplier | null;
  warehouse?: Omit<Warehouse, "images">;
  uom?: UOM;
  base_uom?: UOM & {
    category?: {
      id: number;
      name: string;
      quantity_type?: "INTEGER" | "DECIMAL";
      unit_of_measurements?: UOM[];
    };
  };
  product_movements?: ProductMovement[];
  product_images?: { id: number; image: string; is_primary?: boolean }[];
  product_raw_materials?: ProductRawMaterial[];
}

export interface PnLMovementEntry {
  count: number;
  in_quantity: number;
  out_quantity: number;
  in_total_usd: number;
  out_total_usd: number;
  in_total_riel: number;
  out_total_riel: number;
}

export interface ProductPnL {
  revenue_usd: number;
  revenue_riel: number;
  costs: {
    purchase: { count: number; total_usd: number; total_riel: number };
    reorder: { count: number; total_usd: number; total_riel: number };
    scrap: { count: number; total_usd: number; total_riel: number };
    sales: {
      count: number;
      revenue_usd: number;
      revenue_riel: number;
      cogs_usd: number;
      cogs_riel: number;
    };
    profit_and_loss: {
      product_type: string;
      applied_sale_method: string;
      totals: {
        revenue_usd: number;
        revenue_riel: number;
        cogs_usd: number;
        cogs_riel: number;
        gross_profit_usd: number;
        gross_profit_riel: number;
      };
      by_movement_type: Record<string, PnLMovementEntry>;
    };
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

export interface ProductPnLDetailed {
  product: {
    id: number;
    name: string;
    sku: string;
    product_type: string;
    sale_method: "FIFO" | "LIFO" | string;
  };
  currency: {
    base: string;
    display: string;
    usd_to_riel_rate: number;
  };
  summary: {
    revenue_usd: number;
    revenue_riel: number;
    sales_cogs_usd: number;
    sales_cogs_riel: number;
    scrap_loss_usd: number;
    scrap_loss_riel: number;
    other_loss_usd: number;
    other_loss_riel: number;
    gross_profit_usd: number;
    gross_profit_riel: number;
    net_profit_usd: number;
    net_profit_riel: number;
    gross_margin_pct: number;
    net_margin_pct: number;
  };
  sales: {
    count: number;
    quantity: number;
    revenue_usd: number;
    revenue_riel: number;
    cogs_usd: number;
    cogs_riel: number;
    gross_profit_usd: number;
    gross_profit_riel: number;
    lines: Array<{
      sale_movement_id: number;
      movement_date?: string | null;
      quantity: number;
      revenue_usd: number;
      revenue_riel: number;
      cogs_usd: number;
      cogs_riel: number;
      gross_profit_usd: number;
      sources: Array<{
        source_movement_id: number;
        allocated_quantity?: number;
        consumed_quantity?: number;
        unit_revenue_usd?: number;
        unit_cost_usd?: number;
        line_revenue_usd?: number;
        line_cost_usd?: number;
        cost_source?: string;
      }>;
    }>;
  };
  inventory: {
    incoming_total_qty: number;
    incoming_total_cost_usd: number;
    incoming_total_cost_riel: number;
    remaining_qty: number;
    remaining_cost_usd: number;
    remaining_cost_riel: number;
  };
  cost_breakdown: {
    external_purchase: {
      count: number;
      quantity: number;
      cost_usd: number;
      cost_riel: number;
    };
    internal_production: {
      count: number;
      quantity: number;
      cost_usd: number;
      cost_riel: number;
    };
    reorder: {
      count: number;
      quantity: number;
      cost_usd: number;
      cost_riel: number;
    };
    scrap: {
      count: number;
      cost_usd: number;
      cost_riel: number;
    };
    other_losses: {
      cost_usd: number;
      cost_riel: number;
    };
  };
  internal_manufacturing: {
    is_internal_product: boolean;
    raw_material_spending: {
      initial_production_usd: number;
      initial_production_riel: number;
      reorder_usd: number;
      reorder_riel: number;
      total_usd: number;
      total_riel: number;
      by_raw_material: Array<{
        raw_material_id: number;
        material_name?: string | null;
        material_sku_code?: string | null;
        consumed_qty: number;
        total_usd: number;
        total_riel: number;
        initial_production_usd: number;
        initial_production_riel: number;
        reorder_usd: number;
        reorder_riel: number;
        average_unit_cost_usd: number;
        average_unit_cost_riel: number;
      }>;
    };
    production_batches: Array<{
      movement_id: number;
      movement_type: string;
      movement_date?: string | null;
      quantity: number;
      remaining_quantity: number;
      unit_cost_usd: number;
      unit_cost_riel: number;
      total_cost_usd: number;
      total_cost_riel: number;
      cost_source: string;
    }>;
  };
  movement_counts: {
    total_movements: number;
    by_type: Record<string, number>;
  };
}

export interface GetProductDetailData {
  is_sold: boolean;
  allow_bom_update?: boolean;
  product: Product;
  pricing_reference_lot?: ProductStockLot | null;
  current_qty_in_stock: number;
  available_qty_in_stock?: number;
  ledger_qty_in_stock?: number;
  product_stock_status: string;
  total_count_by_movement_type: Record<string, number>;
  stock_lot_summary?: ProductStockLotSummary;
  stock_lots?: ProductStockLot[];
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

export interface GetProductPnLDetailedResponse {
  status: boolean;
  message: string;
  data: ProductPnLDetailed;
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

export interface ProductStockLotQueryParams {
  include_children?: boolean;
  include_disabled?: boolean;
}

export interface GetProductStockLotsResponse {
  status: boolean;
  message: string;
  data: ProductStockLotsPayload;
}

export interface GetProductScrapEligibleLotsResponse {
  status: boolean;
  message: string;
  data: ProductStockLotsPayload;
}

export interface ProductBomMaterialSummary {
  raw_material_id: number;
  raw_material_name: string;
  uom_name?: string;
  required_qty_per_unit: number;
  planned_total_qty: number;
  actual_consumed_qty: number;
  scrap_qty: number;
  scrap_percentage: number;
  unit_cost_usd: number;
  total_spend_usd: number;
  production_method: "FIFO" | "LIFO" | string;
  stock_lots_used: Array<{
    source_movement_id: number;
    allocated_quantity: number;
    unit_cost_usd: number;
    line_cost_usd: number;
  }>;
}

export interface ProductBomSummary {
  product_id: number;
  product_name: string;
  product_movement_id?: number | null;
  produced_quantity: number;
  total_bom_cost_usd: number;
  average_bom_cost_per_unit_usd: number;
  total_scrap_cost_usd: number;
  materials: ProductBomMaterialSummary[];
}

export interface ProductBomSummaryResponse {
  status: boolean;
  message: string;
  data: ProductBomSummary;
}

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
  expiry_date?: string;
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
  expiry_date?: string;
  note?: string;
  raw_materials: RawMaterialBOM[];
  sale_method: "FIFO" | "LIFO" | string;
}

export interface ReorderInternalManufacturingPayload {
  movement_date: string;
  expiry_date?: string;
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
  expiry_date?: string;
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

export type UpdateProductRequest = Partial<CreateProductRequest>;

export interface CreateScrapMovementPayload {
  source_movement_id: number;
  movement_date?: string;
  quantity: number;
  reason?: string;
  note?: string;
}

export interface UpdateScrapMovementPayload {
  source_movement_id?: number;
  movement_date?: string;
  quantity?: number;
  reason?: string;
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
    product?: Product;
    movement?: ScrapMovement;
    source_lot?: ProductStockLot;
    scrap_movement?: ScrapMovement;
    stock_lot_summary?: ProductStockLotSummary;
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

export interface SaleAllocationPreviewLot {
  source_movement_id: number;
  movement_type: string;
  movement_date?: string | null;
  allocated_quantity: number;
  remaining_quantity_before_sale: number;
  remaining_quantity_after_sale: number;
  selling_unit_price_in_usd: number;
  selling_unit_price_in_riel?: number;
  line_total_usd: number;
  line_total_riel?: number;
}

export interface SaleAllocationPreview {
  product_id: number;
  product_name: string;
  sale_method: "FIFO" | "LIFO";
  requested_quantity: number;
  available_quantity: number;
  can_fulfill: boolean;
  estimated_total_usd: number;
  estimated_total_riel?: number;
  estimated_average_unit_price_usd: number;
  estimated_average_unit_price_riel?: number;
  lots: SaleAllocationPreviewLot[];
  message?: string | null;
}

export interface SaleAllocationPreviewResponse {
  status: boolean;
  message: string;
  data: SaleAllocationPreview;
}
