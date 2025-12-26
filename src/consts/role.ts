export const ROLES = {
  ADMIN: "ADMIN",
  STOCK_CONTROLLER: "STOCK_CONTROLLER",
  VENDER: "VENDER",
} as const;


export const USER_ROLES = [
  { value: "ADMIN", label: "Administrator" },
  { value: "VENDER", label: "Vender" },
  { value: "STOCK_CONTROLLER", label: "Stock Controller" },
];


export type Role = (typeof ROLES)[keyof typeof ROLES];
  