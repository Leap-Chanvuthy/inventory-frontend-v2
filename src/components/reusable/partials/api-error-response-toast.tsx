import { toast } from "sonner";

type ErrorRecord = Record<string, unknown>;

type ApiErrorPayload = {
  message?: string;
  errors?: unknown;
  error?: string;
  data?: unknown;
};

const toMessages = (input: unknown): string[] => {
  if (typeof input === "string") return [input];
  if (Array.isArray(input)) {
    return input
      .flatMap((item) => (typeof item === "string" ? [item] : toMessages(item)))
      .filter(Boolean);
  }
  if (input && typeof input === "object") {
    return Object.values(input as ErrorRecord)
      .flatMap((value) => toMessages(value))
      .filter(Boolean);
  }
  if (input == null) return [];
  return [String(input)];
};

export const resolveApiErrorToast = (
  error: unknown,
  fallbackTitle = "Something went wrong"
) => {
  const payload = (error as { response?: { data?: ApiErrorPayload } })?.response
    ?.data;

  const title = payload?.message || payload?.error || fallbackTitle;

  const errorMessages = toMessages(payload?.errors);
  const dataMessages = toMessages(payload?.data);
  const description = [...errorMessages, ...dataMessages].join(" ").trim() || undefined;

  return { title, description };
};

export const showApiErrorToast = (
  error: unknown,
  fallbackTitle = "Something went wrong"
) => {
  const { title, description } = resolveApiErrorToast(error, fallbackTitle);
  toast.error(title, description ? { description } : undefined);
};

export default showApiErrorToast;
