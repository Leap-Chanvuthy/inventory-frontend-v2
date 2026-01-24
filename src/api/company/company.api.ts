import { BASE_API_URL } from "@/consts/endpoints";
import {
  CompanyResponse,
  UpdateCompanyRequest,
  Company,
  UpdateAddressRequest,
  AddressResponse,
  UpdateTelegramRequest,
  TelegramResponse,
  SetupBankingPaymentRequest,
  BankingPaymentResponse
} from "./company.type";
import { apiClient } from "@/api/client";

// Get company information
export const getCompanyInfo = async (): Promise<CompanyResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/company/info`);
  return response.data;
};

// Update company information
export const updateCompanyInfo = async (
  data: UpdateCompanyRequest
): Promise<{ status: boolean; message: string; data: Company }> => {
  const response = await apiClient.post(`${BASE_API_URL}/company/general-info`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Update company address information
export const updateAddressInfo = async (
  data: UpdateAddressRequest
): Promise<AddressResponse> => {
  const response = await apiClient.post(`${BASE_API_URL}/company/address-info`, data);
  return response.data;
};

// Update telegram notification chat ID
export const updateTelegramInfo = async (
  data: UpdateTelegramRequest
): Promise<TelegramResponse> => {
  const response = await apiClient.post(`${BASE_API_URL}/company/telegram-info`, data);
  return response.data;
};

// Setup banking payment
export const setupBankingPayment = async (
  data: SetupBankingPaymentRequest
): Promise<BankingPaymentResponse> => {
  const response = await apiClient.post(
    `${BASE_API_URL}/company/setup-payment`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
