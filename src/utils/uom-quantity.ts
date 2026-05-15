export const isIntegerQuantityType = (quantityType?: string | null): boolean =>
  String(quantityType || "").toUpperCase() === "INTEGER";

export const isWholeNumberInput = (value: string): boolean => {
  const normalized = value.trim();
  if (normalized === "") {
    return true;
  }

  if (/^-?\d+$/.test(normalized)) {
    return true;
  }

  if (/^-?\d+\.0+$/.test(normalized)) {
    return true;
  }

  const numeric = Number(normalized);
  if (!Number.isFinite(numeric)) {
    return false;
  }

  return Math.abs(numeric - Math.round(numeric)) < 1e-9;
};

export const validateQuantityType = (
  value: string,
  quantityType?: string | null,
): string | null => {
  if (!isIntegerQuantityType(quantityType)) {
    return null;
  }

  return isWholeNumberInput(value)
    ? null
    : "This UOM only allows whole numbers. Decimal values are not allowed.";
};
