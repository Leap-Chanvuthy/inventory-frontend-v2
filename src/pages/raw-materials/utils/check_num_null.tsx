export const toNumberOrNull = (value: string) => {
  if (value === "") return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};
