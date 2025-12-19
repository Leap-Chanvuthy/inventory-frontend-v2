// import { useState, useMemo } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { GlobalPagination } from "@/components/reusable/partials/pagination";
// import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
// import { useUsers } from "@/api/users/user.query";
// import { User } from "@/api/users/user.types";

// const RoleBadge = ({ role }: { role: string }) => {
//   const map: Record<string, string> = {
//     ADMIN: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
//     VENDER: "bg-red-500/10 text-red-600 dark:text-red-400",
//     STOCK_CONTROLLER: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
//   };

//   return <Badge variant="secondary" className={map[role]}>{role}</Badge>;
// };

// const FILTER_OPTIONS = [
//   { value: " ", label: "All" },
//   { value: "ADMIN", label: "Admin" },
//   { value: "VENDER", label: "Vender" },
//   { value: "STOCK_CONTROLLER", label: "Stock Controller" },
// ];

// const SORT_OPTIONS = [
//   { value: "name", label: "Name" },
//   { value: "email", label: "Email" },
//   { value: "-created_at", label: "Newest" },
// ];



// export default function UserList() {
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState<string | undefined>();
//   const [sort, setSort] = useState<string | undefined>();

//   const params = useMemo(() => ({
//     page,
//     "filter[search]": search || undefined,
//     "filter[role]": roleFilter,
//     sort,
//   }), [page, search, roleFilter, sort]);

//   const { data, isLoading, isError } = useUsers(params);

//   if (isError) {
//     return (
//       <div>
//         <p className="text-center text-red-500 py-4">Error loading users. Please try again later.</p>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen w-full p-4 sm:p-6 bg-background">
//       <div className="mx-auto max-w-[1600px]">
//         {/* Toolbar */}
//         <TableToolbar
//           searchPlaceholder="Search users..."
//           onSearch={setSearch}
//           sortOptions={SORT_OPTIONS}
//           onSortChange={(values) => setSort(values[0])}
//           filterOptions={FILTER_OPTIONS}
//           onFilterChange={(val) => setRoleFilter(val || undefined)}
//           createHref="/users/create"
//           onCreate={() => console.log("Create clicked")}
//           onExport={() => console.log("Export clicked")}
//         />

//         {/* Table */}
//         <div className="grid grid-cols-1 rounded-lg border border-border overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-[80px] whitespace-nowrap">Avatar</TableHead>
//                 <TableHead className="whitespace-nowrap">Name</TableHead>
//                 <TableHead className="whitespace-nowrap">Last Activity</TableHead>
//                 <TableHead className="whitespace-nowrap">Email</TableHead>
//                 <TableHead className="whitespace-nowrap">Role</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {isLoading ? (
//                 <TableRow>
//                   <TableCell colSpan={5} className="text-center py-4">
//                     Loading...
//                   </TableCell>
//                 </TableRow>
//               ) : data?.data.length ? (
//                 data.data.map((user: User, idx) => (
//                   <TableRow key={idx}>
//                     <TableCell>
//                       <img
//                         src={user.profile_picture || `https://i.pravatar.cc/150?u=${user.email}`}
//                         alt={user.name}
//                         className="h-10 w-10 rounded-full border border-border"
//                       />
//                     </TableCell>
//                     <TableCell className="font-medium">{user.name}</TableCell>
//                     <TableCell>{user.last_activity || "-"}</TableCell>
//                     <TableCell className="text-muted-foreground">{user.email}</TableCell>
//                     <TableCell>
//                       <RoleBadge role={user.role} />
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={5} className="text-center py-4">
//                     No users found.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center mt-6">
//           <div className="flex items-center gap-1 border border-border rounded-lg p-1">
//             <GlobalPagination
//               currentPage={data?.current_page || 1}
//               lastPage={data?.last_page || 1}
//               onPageChange={setPage}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



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

const RoleBadge = ({ role }: { role: string }) => {
  const map: Record<string, string> = {
    ADMIN: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    VENDER: "bg-red-500/10 text-red-600 dark:text-red-400",
    STOCK_CONTROLLER: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  return <Badge variant="secondary" className={map[role]}>{role}</Badge>;
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
          onSortChange={(values) => setSort(values[0])}
          filterOptions={FILTER_OPTIONS}
          onFilterChange={(val) => setFilter(val || undefined)}
          createHref="/users/create"
        />

        {/* Table */}
        <div className="grid grid-cols-1 rounded-lg border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] whitespace-nowrap">Avatar</TableHead>
                <TableHead className="whitespace-nowrap">Name</TableHead>
                <TableHead className="whitespace-nowrap">Last Activity</TableHead>
                <TableHead className="whitespace-nowrap">Email</TableHead>
                <TableHead className="whitespace-nowrap">Role</TableHead>
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
                        src={user.profile_picture || `https://i.pravatar.cc/150?u=${user.email}`}
                        alt={user.name}
                        className="h-10 w-10 rounded-full border border-border"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.last_activity || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <RoleBadge role={user.role} />
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