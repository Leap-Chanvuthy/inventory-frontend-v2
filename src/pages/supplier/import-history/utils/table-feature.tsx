import { ImportHistoryRecord } from "@/api/suppliers/supplier.types";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";


const RoleBadge = ({ role }: { role: string }) => {
  const map: Record<string, string> = {
    ADMIN: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    VENDER: "bg-red-500/10 text-red-600 dark:text-red-400",
    STOCK_CONTROLLER: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  return (
    <Badge variant="secondary" className={map[role]}>
      {role}
    </Badge>
  );
};

export const SORT_OPTIONS = [
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
  { value: "uploaded_by", label: "Uploaded By" },
  { value: "updated_at", label: "Last Updated" },
];

export const COLUMNS: DataTableColumn<ImportHistoryRecord>[] = [
  {
    key: "icon",
    header: "",
    render: () => <FileSpreadsheet className="h-6 w-6 text-green-600" />,
  },
  {
    key: "filename",
    header: "Filename",
    className: "whitespace-nowrap",
    render: record => (
      <span className="font-medium whitespace-nowrap">{record.filename}</span>
    ),
  },
  {
    key: "size",
    header: "File Size",
    className: "whitespace-nowrap",
    render: record => (
      <span className="text-muted-foreground">{record.size} KB</span>
    ),
  },
  {
    key: "uploaded_by",
    header: "Uploaded By",
    className: "whitespace-nowrap ",
    render: record => (
      <div className="flex flex-col">
        <span className="font-medium">{record?.user?.name}</span>
        <span className="text-sm text-muted-foreground">
          {record?.user?.email}
        </span>
      </div>
    ),
  },
  {
    key: "user_role",
    header: "User Role",
    className: "whitespace-nowrap ",
    render: record => (
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">
          {record.user.role && <RoleBadge role={record.user.role} />}
        </span>
      </div>
    ),
  },
  {
    key: "total_uploaded",
    header: "Total Uploaded",
    className: "whitespace-nowrap py-6",
    render: record => (
      <span className="font-semibold text-green-600">
        {record.total_uploaded} entries
      </span>
    ),
  },
  {
    key: "uploaded_at",
    header: "Uploaded At",
    className: "whitespace-nowrap py-6",
    render: record => (
      <span className="text-muted-foreground">
        {format(new Date(record.uploaded_at), "MMM dd, yyyy HH:mm")}
      </span>
    ),
  },
];
