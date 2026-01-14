/**
 * Downloads a CSV template file with the specified headers
 * @param headers - Array of column headers for the CSV template
 * @param filename - Name of the file to download (without extension)
 */
export const downloadCSVTemplate = (
  headers: string[],
  filename: string = "import_template"
) => {
  // Create CSV content with headers
  const csvContent = headers.join(",") + "\n";

  // Create blob
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
