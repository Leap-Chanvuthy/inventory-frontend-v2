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
  per_page?: number;
  sort?: string;
}


export interface GetUserStatisticResponse {
  total_users: number;
  total_users_as_of_end_last_month: number;
  total_users_trend : {
    delta: number;
    percent: number;
    direction: string;
  }
  total_by_role : {
    ADMIN: string;
    STOCK_CONTROLLER: string;
    VENDER: string;
  }
  verified_users: number;
  unverified_users: number;
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