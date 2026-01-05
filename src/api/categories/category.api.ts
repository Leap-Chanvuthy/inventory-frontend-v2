import { BASE_API_URL } from "@/consts/endpoints";
import { apiClient } from "../client";
import {
  CategoryResponse,
  CategoryQueryParams,
  RawMaterialCategory,
} from "./category.types";

// Raw Material Categories
export const getRawMaterialCategories = async (
  params?: CategoryQueryParams
): Promise<CategoryResponse<RawMaterialCategory>> => {
  const response = await apiClient.get(
    `${BASE_API_URL}/raw-material-categories`,
    { params }
  );
  return response.data;
};
