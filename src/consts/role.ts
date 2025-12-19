export const ROLES = {
  ADMIN: "ADMIN",
  STOCK_CONTROLLER: "STOCK_CONTROLLER",
  VENDER: "VENDER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
  