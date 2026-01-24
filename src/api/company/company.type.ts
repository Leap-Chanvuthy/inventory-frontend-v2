// Banking Information
export interface BankingInfo {
  id: number;
  bank_name: string;
  payment_link: string;
  bank_account_holder_name: string;
  bank_account_number: string;
  khqr_code: string;
  is_default: boolean;
}

// Company Information
export interface Company {
  id: number;
  company_name: string;
  email: string;
  phone_number: string;
  contact_person: string;
  industry_type: string;
  website_url: string;
  date_established: string;
  vat_number: string;
  description: string;
  company_logo: string;
  banking_infos: BankingInfo[];
}

// API Response
export interface CompanyResponse {
  status: boolean;
  message: string;
  data: Company;
}

// Update Company Request
export interface UpdateCompanyRequest {
  company_name: string;
  email: string;
  phone_number: string;
  contact_person: string;
  industry_type: string;
  website_url?: string;
  date_established: string;
  vat_number?: string;
  description?: string;
  company_logo?: string;
}

// Validation Errors
export interface CompanyValidationErrors {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export type UpdateCompanyValidationErrors = {
  errors?: Record<string, string[]>;
};

// Address Information
export interface AddressInfo {
  full_address: string;
  house_number: string;
  street: string;
  commune: string;
  district: string;
  city: string;
}

// Update Address Request
export interface UpdateAddressRequest {
  full_address: string;
  house_number: string;
  street: string;
  commune: string;
  district: string;
  city: string;
}

// Address Response
export interface AddressResponse {
  status: boolean;
  message: string;
  data: AddressInfo;
}

// Telegram Information
export interface TelegramInfo {
  type: string;
  chat_id: string;
}

// Update Telegram Request
export interface UpdateTelegramRequest {
  type: string;
  chat_id: string;
}

// Telegram Response
export interface TelegramResponse {
  status: boolean;
  message: string;
  data: TelegramInfo;
}

// Setup Banking Payment Request
export interface SetupBankingPaymentRequest {
  bank_name: string;
  payment_link: string;
  bank_account_holder_name: string;
  bank_account_number: string;
  khqr_code?: File | string;
  set_as_default: boolean;
}

// Banking Payment Response
export interface BankingPaymentResponse {
  status: boolean;
  message: string;
  data: BankingInfo;
}
