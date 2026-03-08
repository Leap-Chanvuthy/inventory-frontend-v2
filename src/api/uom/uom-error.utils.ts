/**
 * Utilities for parsing structured validation errors returned by the
 * Laravel API (ResponseHelper format):
 *
 *   { status: false, message: "Validation failed", errors: { field: ["msg"] } }
 *
 * Axios rejects non-2xx responses so errors arrive on `error.response.data`.
 */

export interface ParsedApiErrors {
  /** Top-level non-field error message (business logic violations, e.g. duplicate base unit) */
  global?: string;
  /** Field => first error message */
  fields: Record<string, string>;
}

/**
 * Extract field errors and a global message from an Axios error thrown by
 * the API.
 */
export function parseApiError(error: unknown): ParsedApiErrors {
  const data = (error as any)?.response?.data as
    | { status?: boolean; message?: string; errors?: Record<string, string[]> }
    | undefined;

  if (!data) return { fields: {} };

  const fields: Record<string, string> = {};

  if (data.errors && typeof data.errors === "object") {
    for (const [key, msgs] of Object.entries(data.errors)) {
      if (Array.isArray(msgs) && msgs.length > 0) {
        fields[key] = msgs[0];
      }
    }
  }

  // Business-logic violations (e.g. "is_base_unit" or a general message with
  // no structured field errors) are surfaced as a global message.
  const globalFromField = fields.is_base_unit;
  const hasNoFieldErrors = Object.keys(fields).length === 0;
  const global =
    globalFromField ??
    (hasNoFieldErrors && data.message ? data.message : undefined);

  // Remove is_base_unit from fields — it's always shown as a global alert
  const { is_base_unit: _dropped, ...cleanFields } = fields;

  return { global, fields: cleanFields };
}

/**
 * Returns true if the parsed error has any content (field or global).
 */
export function hasErrors(parsed: ParsedApiErrors): boolean {
  return !!parsed.global || Object.keys(parsed.fields).length > 0;
}
