export interface User {
  name: string;
  phone_number: string | null;
  profile_picture: string | null;
  role: string;
  email: string;
  email_verified_at: string | null;
  ip_address: string | null;
  device: string | null;
  last_activity: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
    authorisation: {
      token: string;
      type: string;
    };
  };
}


export type LoginValidationErrors = {
  message: string;
  errors?: Record<string, string[]>;
};
