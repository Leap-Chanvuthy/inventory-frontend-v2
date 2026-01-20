import { BASE_API_URL } from "@/consts/endpoints";
import { CompanyResponse, UpdateCompanyRequest, Company } from "./company.type";
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
