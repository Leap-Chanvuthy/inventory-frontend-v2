import { User } from "@/api/users/user.types";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date-format";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BadgeCheck, SquarePen } from "lucide-react";
import { Link } from "react-router-dom";

export const RoleBadge = ({ role }: { role: string }) => {
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

export const FILTER_OPTIONS = [
  { value: " ", label: "All" },
  { value: "ADMIN", label: "Admin" },
  { value: "VENDER", label: "Vender" },
  { value: "STOCK_CONTROLLER", label: "Stock Controller" },
];

export const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
];

export const COLUMNS: DataTableColumn<User>[] = [
  {
    key: "avatar",
    header: "Avatar",
    render: user => (
      <img
        src={user.profile_picture || ""}
        className="h-10 w-10 rounded-full border"
      />
    ),
  },
  {
    key: "name",
    header: "Name",
    className: "whitespace-nowrap py-6",
    render: user => (
      <Link
        to={`/users/update/${user.id}`}
        className="font-medium underline whitespace-nowrap"
      >
        {user.name}
      </Link>
    ),
  },
  {
    key: "last_activity",
    header: "Last Activity",
    className: "whitespace-nowrap py-6",
    render: user => user.last_activity || "-",
  },
  {
    key: "email",
    header: "Email",
    className: "whitespace-nowrap py-6",
    render: user => <span className="text-muted-foreground">{user.email}</span>,
  },
  {
    key: "role",
    header: "Role",
    className: "whitespace-nowrap py-6",
    render: user => <RoleBadge role={user.role} />,
  },
  {
    key: "created_at",
    header: "Created At",
    className: "whitespace-nowrap py-6",
    render: user => formatDate(user.created_at),
  },
  {
    key: "updated_at",
    header: "Updated At",
    className: "whitespace-nowrap py-6",
    render: user => formatDate(user.updated_at),
  },
  {
    key: "email_verified_at",
    header: "Email Verified At",
    className: "whitespace-nowrap py-6",
    render: user => formatDate(user.email_verified_at),
  },
  {
    key: "verification_status",
    header: "Verification Status",
    className: "whitespace-nowrap py-6",
    render: user =>
      formatDate(user.email_verified_at) ? (
        <BadgeCheck className="w-4 h-4 text-blue-400" />
      ) : (
        "-"
      ),
  },
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: user => (
      <Link to={`/users/update/${user.id}`}>
        <SquarePen size={15} />
      </Link>
    ),
  },
];



export function UserCard({ user }: { user?: User }) {
  if (!user) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <img
          src={user.profile_picture || "/avatar-placeholder.png"}
          className="h-12 w-12 rounded-full border"
          alt={user.name}
        />

        <div>
          <Link
            to={`/users/update/${user.id}`}
            className="font-medium underline"
          >
            {user.name}
          </Link>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div>
          Role: <RoleBadge role={user.role} />
        </div>
        <div>Created: {formatDate(user.created_at)}</div>
        <div>Updated: {formatDate(user.updated_at)}</div>
      </CardContent>
    </Card>
  );
}