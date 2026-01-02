// src/utils/formatDate.ts
import { format, parseISO, isValid } from "date-fns";

type DateInput = string | Date | null | undefined;

/**
 * Format Laravel ISO date string safely
 *
 * @param date - ISO string | Date | null
 * @param dateFormat - date-fns format (default: dd MMM yyyy)
 * @returns formatted date or "-"
 */
export function formatDate(
    date: DateInput,
    dateFormat = "dd MMM yyyy"
): string {
    if (!date) return "-";

    const parsedDate =
        typeof date === "string" ? parseISO(date) : date;

    if (!isValid(parsedDate)) return "-";

    return format(parsedDate, dateFormat);
}
