export const cleanError = (msg?: string) =>
  msg?.replace(/banks\.\d+\./g, "").replace(/_/g, " ");
