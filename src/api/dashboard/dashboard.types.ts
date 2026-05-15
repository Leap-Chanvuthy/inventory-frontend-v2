export interface DashboardMetricTrend {
  current: number;
  previous: number;
  change: number;
  percentage_change: number | null;
  percentage_change_display: string | null;
  direction: "up" | "down" | "neutral";
}

export interface DashboardFilters {
  start_date: string | null;
  end_date: string | null;
  warehouse_id: number | null;
  supplier_id: number | null;
  customer_id: number | null;
  status: string | null;
  user_id: number | null;
}

// ── Users ──────────────────────────────────────────────
export interface UsersSummary {
  metrics: {
    total_users: DashboardMetricTrend;
    new_users_in_period: DashboardMetricTrend;
  };
  charts: {
    users_trend_overtime: Array<{ date: string; label: string; users_count: number }>;
  };
  tables: {
    users_by_role: Array<{ role: string; trend: DashboardMetricTrend }>;
  };
  unavailable_metrics: Array<{ metric: string; reason: string }>;
}

// ── Audit Logs ─────────────────────────────────────────
export interface AuditLogsSummary {
  metrics: {
    total_logs: DashboardMetricTrend;
    logs_in_period: DashboardMetricTrend;
  };
  charts: {
    logs_trend_overtime: Array<{ date: string; label: string; logs_count: number }>;
  };
  tables: {
    latest_10_activities: Array<{
      id: number;
      user_id: number;
      user_name: string;
      activity: string;
      description: string;
      created_at: string;
    }>;
    top_10_most_performed_activities: Array<{
      activity: string;
      count: number;
      trend: DashboardMetricTrend;
    }>;
  };
  unavailable_metrics: Array<{ metric: string; reason: string }>;
}

// ── Suppliers ──────────────────────────────────────────
export interface SuppliersSummary {
  metrics: {
    total_suppliers: DashboardMetricTrend;
  };
  charts: {
    suppliers_trend_overtime: Array<{ date: string; label: string; suppliers_count: number }>;
  };
  tables: {
    top_10_suppliers_by_supplied_items: Array<{
      supplier_id: number;
      supplier_name: string;
      supplied_items_count: number;
      raw_materials_count: number;
      products_count: number;
      trend: DashboardMetricTrend;
    }>;
  };
  unavailable_metrics: Array<{ metric: string; reason: string }>;
}

// ── Raw Materials ──────────────────────────────────────
export interface RawMaterialsSummary {
  metrics: {
    total_raw_materials: DashboardMetricTrend;
    out_of_stock_raw_materials: DashboardMetricTrend;
    low_stock_raw_materials: DashboardMetricTrend;
  };
  charts: {
    raw_material_usage_trend_overtime: Array<{
      date: string;
      label: string;
      used_quantity: number;
    }>;
  };
  tables: {
    top_10_most_used_raw_materials_in_production: Array<{
      raw_material_id: number;
      raw_material_name: string;
      total_used_quantity: number;
      uom_name: string;
      production_count: number;
      trend: DashboardMetricTrend;
    }>;
    top_10_expensive_raw_materials: Array<{
      raw_material_id: number;
      raw_material_name: string;
      unit_price: number;
      currency: string;
      supplier_name: string;
      trend: DashboardMetricTrend;
    }>;
  };
  unavailable_metrics: Array<{ metric: string; reason: string }>;
}

// ── Products ───────────────────────────────────────────
export interface ProductsSummary {
  metrics: {
    total_products: DashboardMetricTrend;
    new_products_in_period: DashboardMetricTrend;
  };
  charts: {
    sale_trend_overtime: Array<{
      date: string;
      orders_count: number;
      quantity_sold: number;
      revenue: number;
    }>;
  };
  tables: {
    top_10_most_selling_products_with_customer: Array<{
      product_id: number;
      product_name: string;
      total_quantity_sold: number;
      total_revenue: number;
      top_customer: {
        customer_id: number;
        customer_name: string;
        quantity_purchased: number;
        revenue: number;
      } | null;
      trend: DashboardMetricTrend;
    }>;
    last_10_sale_orders_with_customer: Array<{
      sale_order_id: number;
      sale_order_number: string;
      customer_id: number;
      customer_name: string;
      status: string;
      total_amount: number;
      ordered_at: string;
      created_at: string;
    }>;
  };
  unavailable_metrics: Array<{ metric: string; reason: string }>;
}

// ── Warehouses ─────────────────────────────────────────
export interface WarehousesSummary {
  metrics: {
    total_warehouses: DashboardMetricTrend;
    new_warehouses_in_period: DashboardMetricTrend;
    warehouses_with_stock: DashboardMetricTrend;
  };
  charts: {
    warehouses_trend_overtime: Array<{ date: string; label: string; warehouses_count: number }>;
  };
  tables: Record<string, unknown>;
  unavailable_metrics: Array<{ metric: string; reason: string }>;
}

// ── Sale Orders ─────────────────────────────────────────
export interface SaleOrderStatusTrend extends DashboardMetricTrend {
  status: string;
}

export interface SaleOrdersSummary {
  metrics: {
    total_sale_orders: DashboardMetricTrend;
    total_revenue: DashboardMetricTrend;
    total_refunded: DashboardMetricTrend;
    total_discount: DashboardMetricTrend;
    average_order_value: DashboardMetricTrend;
    sale_orders_by_status: Array<SaleOrderStatusTrend>;
    sale_order_count_by_type: Record<string, DashboardMetricTrend>;
  };
  charts: {
    revenue_trend_overtime: Array<{
      date: string;
      revenue: number;
      discount: number;
      refunded: number;
      net_revenue: number;
    }>;
    order_count_trend_overtime: Array<{ date: string; label: string; orders_count: number }>;
  };
  tables: Record<string, unknown>;
  unavailable_metrics: Array<{ metric: string; reason: string }>;
}

// ── Customers ──────────────────────────────────────────
export interface CustomersSummary {
  metrics: {
    total_customers: DashboardMetricTrend;
    active_customers: DashboardMetricTrend;
  };
  charts: {
    customers_trend_overtime: Array<{ date: string; label: string; customers_count: number }>;
  };
  tables: {
    top_10_customers_by_most_purchasing: Array<{
      customer_id: number;
      customer_name: string;
      orders_count: number;
      total_quantity_purchased: number;
      total_revenue: number;
      trend: DashboardMetricTrend;
    }>;
    top_10_customers_by_revenue: Array<{
      customer_id: number;
      customer_name: string;
      orders_count: number;
      total_quantity_purchased: number;
      total_revenue: number;
      trend: DashboardMetricTrend;
    }>;
  };
  unavailable_metrics: Array<{ metric: string; reason: string }>;
}

// ── UOMs ───────────────────────────────────────────────
export interface UomsSummary {
  charts: {
    uoms_trend_overtime: Array<{ date: string; label: string; uoms_count: number }>;
  };
  tables: {
    top_10_uom_by_products_count: Array<{
      uom_id: number;
      uom_name: string;
      products_count: number;
      trend: DashboardMetricTrend;
    }>;
    top_10_uom_by_raw_materials_count: Array<{
      uom_id: number;
      uom_name: string;
      raw_materials_count: number;
      trend: DashboardMetricTrend;
    }>;
  };
  unavailable_metrics: Array<{ metric: string; reason: string }>;
}

// ── Categories ─────────────────────────────────────────
export interface CategoriesSummary {
  tables: {
    top_10_categories_by_products_count: Array<{
      category_id: number;
      category_name: string;
      products_count: number;
      trend: DashboardMetricTrend;
    }>;
    top_10_categories_by_raw_materials_count: Array<{
      category_id: number;
      category_name: string;
      raw_materials_count: number;
      trend: DashboardMetricTrend;
    }>;
    top_10_categories_by_customers_count: Array<{
      category_id: number;
      category_name: string;
      customers_count: number;
      trend: DashboardMetricTrend;
    }>;
  };
  unavailable_metrics: Array<{ metric: string; reason: string }>;
}

// ── Root response ──────────────────────────────────────
export interface DashboardSummaryData {
  filters: DashboardFilters;
  comparison_period: {
    previous_start_date: string;
    previous_end_date: string;
  };
  summary: {
    users: UsersSummary;
    audit_logs: AuditLogsSummary;
    suppliers: SuppliersSummary;
    raw_materials: RawMaterialsSummary;
    products: ProductsSummary;
    warehouses: WarehousesSummary;
    sale_orders: SaleOrdersSummary;
    customers: CustomersSummary;
    uoms: UomsSummary;
    categories: CategoriesSummary;
  };
}

export interface DashboardSummaryResponse {
  success: boolean;
  message: string;
  data: DashboardSummaryData;
}

export interface DashboardSummaryParams {
  start_date?: string;
  end_date?: string;
  warehouse_id?: number;
  supplier_id?: number;
  customer_id?: number;
  status?: string;
  user_id?: number;
}
