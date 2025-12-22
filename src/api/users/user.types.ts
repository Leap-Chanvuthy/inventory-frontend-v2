export interface User {
  name: string;
  phone_number: string | null;
  profile_picture: string | null;
  role: string;
  email: string;
  last_activity: string | null;
  created_at: string;
  updated_at: string;
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
    role: 'ADMIN' | 'STOCK_CONTROLLER' | 'VENDER';
    phone_number?: string;
    profile_picture?: string;
}


export interface CreateUserValidationErrors {
  message: string;
  errors?: Record<string, string[]>;
}