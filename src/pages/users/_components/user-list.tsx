import { useState } from "react"


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


import { Badge } from "@/components/ui/badge"
import { GlobalPagination } from "@/components/reusable/partials/pagination"
import { TableToolbar } from "@/components/reusable/partials/table-toolbar"


const users = [
  { id: 1, name: "Alice Johnson", email: "alice.j@example.com", role: "Admin", lastLogin: "10 days ago", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Bob Williams", email: "bob.w@example.com", role: "Vender", lastLogin: "2 days ago", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Charlie Davis", email: "charlie.d@example.com", role: "Stock Controller", lastLogin: "5 minutes ago", avatar: "https://i.pravatar.cc/150?u=3" },
  { id: 4, name: "Diana Miller", email: "diana.m@example.com", role: "Admin", lastLogin: "10 seconds ago", avatar: "https://i.pravatar.cc/150?u=4" },
  { id: 5, name: "Eve Brown", email: "eve.b@example.com", role: "Admin", lastLogin: "4 days ago", avatar: "https://i.pravatar.cc/150?u=5" },
  { id: 6, name: "Frank White", email: "frank.w@example.com", role: "Vender", lastLogin: "20 minutes ago", avatar: "https://i.pravatar.cc/150?u=6" },
    { id: 1, name: "Alice Johnson", email: "alice.j@example.com", role: "Admin", lastLogin: "10 days ago", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Bob Williams", email: "bob.w@example.com", role: "Vender", lastLogin: "2 days ago", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Charlie Davis", email: "charlie.d@example.com", role: "Stock Controller", lastLogin: "5 minutes ago", avatar: "https://i.pravatar.cc/150?u=3" },
]


const RoleBadge = ({ role }: { role: string }) => {
  const map: Record<string, string> = {
    Admin: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    Vender: "bg-red-500/10 text-red-600 dark:text-red-400",
    "Stock Controller": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  }

  return (
    <Badge variant="secondary" className={map[role]}>
      {role}
    </Badge>
  )
}


export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 bg-background">
      <div className="mx-auto max-w-[1600px]">
        {/* Toolbar */}
        
        <TableToolbar
          searchPlaceholder="Search users..."
          onSearch={(val) => console.log("Search:", val)}
          sortOptions={[
            { value: "name", label: "Name" },
            { value: "email", label: "Email" },
            { value: "role", label: "Role" },
          ]}
          onSortChange={(values) => console.log("Sort selected:", values)}
          filterOptions={[
            { value: "admin", label: "Admin" },
            { value: "vender", label: "Vender" },
          ]}
          onFilterChange={(val) => console.log("Filter selected:", val)}
          createHref="/users/create"
          onCreate={() => console.log("Create clicked")}
          onExport={() => console.log("Export clicked")}
        />


        {/* Table */}
        <div className="grid grid-cols-1 rounded-lg border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] whitespace-nowrap">Avatar</TableHead>
                <TableHead className="whitespace-nowrap">Name</TableHead>
                <TableHead className="whitespace-nowrap">Last Login</TableHead>
                <TableHead className="whitespace-nowrap">Email</TableHead>
                <TableHead className="whitespace-nowrap">Role</TableHead>
                <TableHead className="w-0">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="whitespace-nowrap">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-10 w-10 rounded-full border border-border"
                    />
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">
                    {user.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{user.lastLogin}</TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {user.email}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <RoleBadge role={user.role} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
             <GlobalPagination />
          </div>
        </div>
      </div>
    </div>
  )
}
