export type GetWarehousesParams = {
  per_page?: number;
  "filter[search]"?: string;
  "filter[status]"?: string;
  sort?: string;
};

// Get Warehouse Type Responses

export type WarehouseImage = {
  id: number;
  warehouse_id: number;
  image: string;
  created_at: string;
  updated_at: string;
};

export type SubWarehouse = {
  id: number;
  warehouse_id: number;
  warehouse_name: string;
  warehouse_manager: string | null;
  warehouse_manager_contact: string | null;
  warehouse_manager_email: string | null;
  warehouse_address: string;
  latitude: string | null;
  longitude: string | null;
  warehouse_description: string | null;
  created_at: string;
  updated_at: string;
};

export type SubWarehousePayload = {
  warehouse_name: string;
  warehouse_address: string;
  warehouse_manager?: string;
  warehouse_manager_contact?: string;
  warehouse_manager_email?: string;
  latitude?: string;
  longitude?: string;
  warehouse_description?: string;
};

export type Warehouse = {
  id: number;
  warehouse_name: string;
  warehouse_manager: string | null;
  warehouse_manager_contact: string | null;
  warehouse_manager_email: string | null;
  warehouse_address: string;
  latitude: string | null;
  longitude: string | null;
  warehouse_description: string | null;
  created_at: string;
  updated_at: string;
  images: WarehouseImage[];
  sub_warehouses?: SubWarehouse[];
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

export type GetWarehousesResponse = {
  status: boolean;
  message: string;
  data: PaginatedData<Warehouse>;
};

// Create Warehouse Payload Type

export interface CreateWarehousesPayload {
  warehouse_name: string;
  warehouse_address: string;

  warehouse_manager?: string;
  warehouse_manager_contact?: string;
  warehouse_manager_email?: string;

  latitude?: string;
  longitude?: string;

  warehouse_description?: string;

  images?: File[];
  sub_warehouses?: SubWarehousePayload[];
}

export interface CreateWarehouse {
  status: boolean;
  message: string;
  data: Warehouse;
}

export interface CreateWarehouseValidationErrors {
  errors?: {
    warehouse_name?: string[];
    warehouse_manager?: string[];
    warehouse_manager_contact?: string[];
    warehouse_manager_email?: string[];
    warehouse_address?: string[];
    latitude?: string[];
    longitude?: string[];
    warehouse_description?: string[];
    images?: string[];
    sub_warehouses?: string[];
    [key: string]: string[] | undefined;
  };
}

export interface UpdateWarehouseValidationErrors {
  errors?: {
    warehouse_name?: string[];
    warehouse_manager?: string[];
    warehouse_manager_contact?: string[];
    warehouse_manager_email?: string[];
    warehouse_address?: string[];
    latitude?: string[];
    longitude?: string[];
    warehouse_description?: string[];
    images?: string[];
    sub_warehouses?: string[];
    [key: string]: string[] | undefined;
  };
}
