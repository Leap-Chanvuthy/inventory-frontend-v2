// ── UOM Category ─────────────────────────────────────────────────────────────

export type UomCategory = {
  id: number;
  name: string;
  description: string | null;
  units_count?: number;
  base_unit?: UOM | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type UomCategoryQueryParams = {
  per_page?: number;
  page?: number;
  "filter[search]"?: string;
  sort?: string;
};

export type TrashedCategoryQueryParams = {
  per_page?: number;
  page?: number;
  "filter[search]"?: string;
};

export type CreateUomCategoryRequest = {
  name: string;
  description?: string;
};

export type UomCategoryValidationErrors = {
  message: string;
  errors: {
    name?: string[];
    description?: string[];
  };
};

// ── Unit of Measurement ───────────────────────────────────────────────────────

export type UOM = {
  id: number;
  uom_code: string;
  name: string;
  symbol: string | null;
  description: string | null;
  is_active: number;
  // new fields
  category_id: number | null;
  base_uom_id: number | null;
  conversion_factor: string | number;
  is_base_unit: number;
  category?: UomCategory | null;
  baseUom?: UOM | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TrashedUOMQueryParams = {
  per_page?: number;
  page?: number;
  "filter[category_id]"?: number;
};

export type UOMQueryParams = {
  per_page?: number;
  page?: number;
  "filter[search]"?: string;
  "filter[id]"?: number;
  "filter[is_active]"?: boolean;
  "filter[category_id]"?: number;
  "filter[is_base_unit]"?: boolean;
  sort?: string;
};

export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type PaginatedData<T> = {
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
};

export type GetUOMsResponse = PaginatedData<UOM>;
export type GetUomCategoriesResponse = PaginatedData<UomCategory>;

export type CreateUOMRequest = {
  name: string;
  /** uom_code is NOT sent by the client — the backend generates it automatically */
  symbol?: string;
  description?: string;
  is_active?: boolean;
  category_id: number | null;
  is_base_unit: boolean;
  base_uom_id?: number | null;
  conversion_factor: number;
};

export type UOMValidationErrors = {
  message: string;
  errors: {
    name?: string[];
    symbol?: string[];
    category_id?: string[];
    is_base_unit?: string[];
    conversion_factor?: string[];
    base_uom_id?: string[];
    description?: string[];
  };
};

export type CreateUOMValidationErrors = {
  message: string;
  errors: {
    name?: string[];
    symbol?: string[];
    description?: string[];
    is_active?: string[];
    category_id?: string[];
    is_base_unit?: string[];
    base_uom_id?: string[];
    conversion_factor?: string[];
  };
};
