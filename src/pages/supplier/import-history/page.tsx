import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { ImportHistoryList } from "./_components/import-history-list";

function ImportHistory() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "supplier", label: "Supplier", link: "/supplier" },
    { name: "import-history", label: "Import History" },
  ];

  return (
    <div>
      <div className="px-6">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <ImportHistoryList />
    </div>
  );
}

export default ImportHistory;
