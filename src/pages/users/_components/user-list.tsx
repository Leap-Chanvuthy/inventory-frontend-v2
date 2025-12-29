import { Badge } from "@/components/ui/badge";
import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useUsers } from "@/api/users/user.query";
import { User } from "@/api/users/user.types";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { BadgeCheck, SquarePen, Table } from "lucide-react";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/reusable/data-table/data-table";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";

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

const FILTER_OPTIONS = [
  { value: " ", label: "All" },
  { value: "ADMIN", label: "Admin" },
  { value: "VENDER", label: "Vender" },
  { value: "STOCK_CONTROLLER", label: "Stock Controller" },
];

const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
];

const columns: DataTableColumn<User>[] = [
  {
    key: "avatar",
    header: "Avatar",
    render: user => (
      <img
        src={
          user.profile_picture || `https://i.pravatar.cc/150?u=${user.email}`
        }
        className="h-10 w-10 rounded-full border"
      />
    ),
  },
  {
    key: "name",
    header: "Name",
    render: user => (
      <Link to={`/users/update/${user.id}`} className="font-medium underline">
        {user.name}
      </Link>
    ),
  },
  {
    key: "last_activity",
    header: "Last Activity",
    render: user => user.last_activity || "-",
  },
  {
    key: "email",
    header: "Email",
    render: user => <span className="text-muted-foreground">{user.email}</span>,
  },
  {
    key: "role",
    header: "Role",
    render: user => <RoleBadge role={user.role} />,
  },
  {
    key: "created_at",
    header: "Created At",
    render: user => new Date(user.created_at).toLocaleDateString(),
  },
  {
    key: "updated_at",
    header: "Updated At",
    render: user => new Date(user.updated_at).toLocaleDateString(),
  },
  {
    key: "verified",
    header: "Email Verified",
    render: user =>
      user.email_verified_at ? (
        <BadgeCheck className="w-4 h-4 text-blue-400" />
      ) : (
        "-"
      ),
  },
  {
    key: "actions",
    header: "Actions",
    render: user => (
      <Link to={`/users/update/${user.id}`}>
        <SquarePen size={15} />
      </Link>
    ),
  },
];

export default function UserList() {
  const {
    // page,
    setPage,
    setSearch,
    setSort,
    filter,
    setFilter,
    apiParams,
  } = useTableQueryParams();

  const { data, isLoading, isError } = useUsers({
    ...apiParams,
    "filter[role]": filter,
  });

  if (isError) {
    return <p className="text-center text-red-500">Failed to load users</p>;
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 bg-background">
      <div className="mx-auto max-w-[1600px]">
        {/* Toolbar */}
        <TableToolbar
          searchPlaceholder="Search users..."
          onSearch={setSearch}
          sortOptions={SORT_OPTIONS}
          onSortChange={values => setSort(values[0])}
          filterOptions={FILTER_OPTIONS}
          onFilterChange={val => setFilter(val || undefined)}
          createHref="/users/create"
        />

        {/* Data Table */}
        <DataTable<User>
          columns={columns}
          data={data?.data}
          isLoading={isLoading}
          emptyText="No users found"
        />

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <GlobalPagination
              currentPage={data?.current_page || 1}
              lastPage={data?.last_page || 1}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
