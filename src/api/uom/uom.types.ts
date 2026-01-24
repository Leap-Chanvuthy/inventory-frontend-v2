export type UOM = {
  id: number;
  uom_code: string;
  name: string;
  symbol: string;
  uom_type: string;
  description: string;
  is_active: number;
  created_at: string;
  updated_at: string;
};

export type UOMQueryParams = {
  per_page?: number;
  page?: number;
  "filter[search]"?: string;
  "filter[id]"?: number;
  "filter[is_active]"?: boolean;
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

export type CreateUOMRequest = {
  name: string;
  symbol: string;
  uom_type: string;
  description?: string;
  is_active?: boolean;
};

export type CreateUOMValidationErrors = {
  message: string;
  errors: {
    name?: string[];
    symbol?: string[];
    uom_type?: string[];
    description?: string[];
    is_active?: string[];
  };
};
