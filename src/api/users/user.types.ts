export interface User {
  id: number;
  name: string;
  phone_number: string | null;
  profile_picture: string | null;
  role: string;
  email: string;
  last_activity: string | null;
  created_at: string;
  updated_at: string;
  email_verified_at: string | null;
  ip_address: string | null;
  devices: number;
}

export interface GetUsersResponse {
  current_page: number;
  data: User[];
  last_page: number;
  per_page: number;
  total: number;
}

export interface GetUsersParams {
  page?: number;
  "filter[id]"?: number;
  "filter[role]"?: string;
  "filter[search]"?: string;
  sort?: string;
}



export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string | 'ADMIN' | 'STOCK_CONTROLLER' | 'VENDER';
    phone_number: string;
    profile_picture: File | null,
}

export interface UpdateUserPayload {
    name: string;
    email: string;
    role: string | 'ADMIN' | 'STOCK_CONTROLLER' | 'VENDER';
    phone_number: string;
    profile_picture: File | string | null,
}


export interface CreateUserValidationErrors {
  message: string;
  errors?: Record<string, string[]>;
}