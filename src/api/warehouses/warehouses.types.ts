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

export type Warehouse = {
  id: number;
  warehouse_name: string;
  warehouse_manager: string;
  warehouse_manager_contact: string;
  warehouse_manager_email: string;
  warehouse_address: string;
  latitude: string;
  longitude: string;
  warehouse_description: string;
  capacity_units: number;
  capacity_percentage: number;
  // status: 'Active' | 'Low Stock' | 'Full' | 'Inactive';
  created_at: string;
  updated_at: string;
  images: WarehouseImage[];
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
}

export interface CreateWarehouse {
  status: boolean;
  message: string;
  data: Warehouse;
}
