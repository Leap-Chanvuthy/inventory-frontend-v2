import { useState } from "react";
import { useRoles } from "@/api/roles/role.query";
import { Role } from "@/api/roles/role.types";
import { useAuth } from "@/hooks/useAuth";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { ToggleableList } from "@/components/reusable/partials/toggleable-list";
import { GlobalPagination } from "@/components/reusable/partials/pagination";
import UnexpectedError from "@/components/reusable/partials/error";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { ROLE_COLUMNS, ROLE_SORT_OPTIONS, RoleCard } from "../utils/table-feature";

export default function RoleList() {
  const { canAny } = useAuth();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<string | undefined>("-created_at");

  const { data, isLoading, isFetching, isError } = useRoles({
    page,
    per_page: perPage,
    search: search || undefined,
  });

  const canCreate = canAny(["roles.create"]);

  if (isError && !isFetching) {
    return <UnexpectedError kind="fetch" hideHomeButton hideBackButton />;
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 bg-background">
      <div className="mx-auto max-w-full">
        <TableToolbar
          searchPlaceholder="Search roles..."
          onSearch={value => {
            setSearch(value);
            setPage(1);
          }}
          search={search}
          sortOptions={ROLE_SORT_OPTIONS}
          selectedSort={sort ? [sort] : []}
          onSortChange={values => {
            setSort(values[0]);
            setPage(1);
          }}
          requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
          onPerPageChange={value => {
            setPerPage(value);
            setPage(1);
          }}
          perPage={perPage}
          createHref={canCreate ? "/roles/create" : undefined}
          isListOptionDisplayed={true}
        />

        <ToggleableList<Role>
          items={[...(data?.data || [])].sort((a, b) => {
            if (!sort || sort === "-created_at") {
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            if (sort === "created_at") {
              return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            }
            if (sort === "name") {
              return a.name.localeCompare(b.name);
            }
            if (sort === "key") {
              return a.key.localeCompare(b.key);
            }
            return 0;
          })}
          isLoading={isLoading}
          loadingText="Loading role data..."
          emptyText="No roles found"
          columns={ROLE_COLUMNS}
          renderItem={role => <RoleCard role={role} />}
        />

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
