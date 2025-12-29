import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useUsers } from "@/api/users/user.query";
import { User } from "@/api/users/user.types";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { BadgeCheck, SquarePen } from "lucide-react";
import { Link } from "react-router-dom";

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

        {/* Table */}
        <div className="grid grid-cols-1 rounded-lg border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[80px] whitespace-nowrap">
                  Avatar
                </TableHead>
                <TableHead className="whitespace-nowrap py-4">Name</TableHead>
                <TableHead className="whitespace-nowrap">
                  Last Activity
                </TableHead>
                <TableHead className="whitespace-nowrap">Email</TableHead>
                <TableHead className="whitespace-nowrap">Role</TableHead>
                <TableHead className="whitespace-nowrap">IP Address</TableHead>
                <TableHead className="whitespace-nowrap">Devices</TableHead>
                <TableHead className="whitespace-nowrap">Created At</TableHead>
                <TableHead className="whitespace-nowrap">Updated At</TableHead>
                <TableHead className="whitespace-nowrap">
                  Email Verified
                </TableHead>
                <TableHead className="whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data?.data.length ? (
                data.data.map((user: User, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <img
                        src={
                          user.profile_picture ||
                          `https://i.pravatar.cc/150?u=${user.email}`
                        }
                        alt={user.name}
                        className="h-10 w-10 rounded-full border border-border"
                      />
                    </TableCell>
                    <TableCell className="font-medium underline">
                      <Link to={`/users/update/${user.id}`}>{user.name}</Link>
                    </TableCell>
                    <TableCell>{user.last_activity || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>
                    <TableCell>{user.ip_address || "-"}</TableCell>
                    <TableCell>{user.devices}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(user.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.email_verified_at ? (
                        <BadgeCheck className="text-blue-400 w-4 h-4" />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <Link
                          to={`/users/update/${user.id}`}
                          className="text-sm"
                        >
                          <SquarePen size="15" />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

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
