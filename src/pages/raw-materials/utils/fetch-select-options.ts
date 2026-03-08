import { getRawMaterialCategories } from "@/api/categories/raw-material-categories/raw-material-category.api";
import { getSuppliers } from "@/api/suppliers/supplier.api";
import { getWarehouses } from "@/api/warehouses/warehouses.api";
import { getUOMs, getUomCategories } from "@/api/uom/uom.api";
import type { FetchParams, FetchResult } from "@/components/reusable/partials/searchable-select";

export const fetchCategories = async (params: FetchParams): Promise<FetchResult> => {
  const res = await getRawMaterialCategories(params);
  return {
    data: res.data.data.map(cat => ({
      value: String(cat.id),
      label: cat.category_name,
    })),
    current_page: res.data.current_page,
    last_page: res.data.last_page,
  };
};

export const fetchSuppliers = async (params: FetchParams): Promise<FetchResult> => {
  const res = await getSuppliers(params);
  return {
    data: res.data.data.map(sup => ({
      value: String(sup.id),
      label: sup.official_name,
    })),
    current_page: res.data.current_page,
    last_page: res.data.last_page,
  };
};

export const fetchWarehouses = async (params: FetchParams): Promise<FetchResult> => {
  const res = await getWarehouses(params);
  return {
    data: res.data.map(wh => ({
      value: String(wh.id),
      label: wh.warehouse_name,
    })),
    current_page: res.current_page,
    last_page: res.last_page,
  };
};

export const fetchUOMs = async (params: FetchParams): Promise<FetchResult> => {
  const res = await getUOMs(params);
  return {
    data: res.data.map(uom => ({
      value: String(uom.id),
      label: `${uom.name} (${uom.symbol})`,
    })),
    current_page: res.current_page,
    last_page: res.last_page,
  };
};

export const fetchUomCategories = async (params: FetchParams): Promise<FetchResult> => {
  const res = await getUomCategories(params);
  return {
    data: res.data.map(cat => {
      // base_unit is a HasOne — single UOM object. Guard against any legacy
      // array shape just in case.
      const rawBase = cat.base_unit;
      const base = Array.isArray(rawBase) ? rawBase[0] : rawBase;
      const label = base
        ? `${cat.name} | ${base.name}${base.symbol ? ` (${base.symbol})` : ""} [Base Unit]`
        : cat.name;
      return { value: String(cat.id), label };
    }),
    current_page: res.current_page,
    last_page: res.last_page,
  };
};
