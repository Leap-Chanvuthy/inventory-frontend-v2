import { useState } from "react";
import { useUsers } from "@/api/users/user.query";
import { User } from "@/api/users/user.types";
import { DataSelectionModal } from "@/components/reusable/data-modal/data-selection-modal";
import { columns, FILTER_OPTIONS, SORT_OPTIONS } from "../utils/table-feature";
import { useTableQueryParams } from "@/hooks/use-table-query-params";


export function UserSelectModal() {
    const [open, setOpen] = useState(false);
    const {
        // page,
        setPage,
        setSearch,
        setSort,
        filter,
        setFilter,
        // api ready params
        apiParams,
    } = useTableQueryParams();

    const { data, isLoading } = useUsers({
        ...apiParams,
        "filter[role]": filter,
    });



    return (
        <>
            <button
                className="btn btn-primary"
                onClick={() => setOpen(true)}
            >
                Select Users
            </button>

            <DataSelectionModal<User>
                open={open}
                onClose={() => setOpen(false)}
                title="Select Users"
                scope="user-selection-modal"
                isLoading={isLoading}
                emptyText="No users found."
                mode="multiple"
                data={data?.data}
                columns={columns}
                getRowId={user => user.id}

                // ✅ pagination
                currentPage={data?.current_page}
                lastPage={data?.last_page}
                onPageChange={setPage}

                // Search & Filter & Sort
                searchPlaceholder="Search users..."
                onSearch={setSearch}
                sortOptions={SORT_OPTIONS}
                onSortChange={setSort}
                filterOptions={FILTER_OPTIONS}
                onFilterChange={setFilter}
                createHref="/users/create"

                onConfirm={users => {
                    console.log("Selected users:", users);
                }}
            />
        </>
    );
}
