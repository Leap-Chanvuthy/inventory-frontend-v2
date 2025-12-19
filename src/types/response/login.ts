// src/types/api-error.ts
export type LoginValidationErrors = {
  message: string;
  errors?: Record<string, string[]>;
};
