import { UomCategory } from "@/api/uom/uom.types";

export type UomCategoryValidationResult = {
  isValid: boolean;
  baseUnitId: number | null;
};

export function validateUomCategoryConfiguration(
  category?: UomCategory | null,
): UomCategoryValidationResult {
  if (!category) {
    return { isValid: false, baseUnitId: null };
  }

  const rawBase = category.base_unit;
  const baseUnit = Array.isArray(rawBase) ? rawBase[0] : rawBase;
  const baseUnitId = baseUnit?.id ? Number(baseUnit.id) : null;

  const unitsCount = Number(category.units_count ?? (baseUnitId ? 1 : 0));
  const hasUnits = Number.isFinite(unitsCount) && unitsCount > 0;

  return {
    isValid: !!baseUnitId && hasUnits,
    baseUnitId,
  };
}
