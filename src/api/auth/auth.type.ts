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
  two_factor_enabled: boolean;
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

export interface TwoFactorChallengeResponse {
  status: boolean;
  message: string;
  data: {
    two_factor_required: boolean;
    two_factor_token: string;
  };
}

export interface TwoFactorLoginPayload {
  two_factor_token: string;
  code?: string;
  recovery_code?: string;
}

export type LoginApiResponse = LoginResponse | TwoFactorChallengeResponse;


export type LoginValidationErrors = {
  message: string;
  errors?: Record<string, string[]>;
};



export interface VerifyEmailPayload {
    token: string;
}


export interface VerifyEmailSuccessResponse {
    status: boolean,
    message: string,
    data?: null,
}

export interface VerifyEmailErrorResponse {
    status: boolean,
    message: string,
    errors?: string,
}


// Forgot Password Types
export interface ForgotPasswordPayload  {
  email: string;
}

export interface ForgotPasswordResponse {
  status: boolean;
  message: string;
  data?: null;
}
export interface ForgotPasswordErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}


// Reset Password Types
export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// ...existing code...

export type ResetPasswordSuccessResponse = {
  status: true;
  message: string; // "Password reset successful"
  data: {
    message: string; // e.g. "Your password has been reset."
  };
};

export type ResetPasswordErrorResponse = {
  status: false;
  message: string; // "Password reset failed" | "Something went wrong"
  errors: {
    error?: string;
    password?: string[];
  };
};

export type ResetPasswordResponse =
  | ResetPasswordSuccessResponse
  | ResetPasswordErrorResponse;


// Two-Factor Authentication Types
export interface TwoFactorSetupResponse {
  status: boolean;
  message: string;
  data: {
    qr_code: string; // base64 data URL
    secret: string;
    recovery_codes: string[];
  };
}

export interface TwoFactorSetupErrorResponse {
  status: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface TwoFactorConfirmPayload {
  code: string;
}

export interface TwoFactorConfirmResponse {
  status: boolean;
  message: string;
}

export interface TwoFactorStatusResponse {
  status: boolean;
  message: string;
  data: {
    two_factor_enabled: boolean;
  };
}