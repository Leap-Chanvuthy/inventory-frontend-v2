import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    initScope,
    clearScope,
    //   setMode,
    //   toggle,
    setSelection,
    selectSelectedItems,
    SelectionMode,
} from "@/redux/slices/selection-slice";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/reusable/data-table/data-table";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { GlobalPagination } from "../partials/pagination";
import { TableToolbar } from "../partials/table-toolbar";

type DataSelectionModalProps<T> = {
    // actions
    open: boolean;
    onClose: () => void;
    onConfirm: (rows: T[]) => void;

    // texts
    isLoading?: boolean;
    emptyText?: string;
    title: string;

    // data
    scope: string;
    mode?: SelectionMode;
    data?: T[];
    columns: DataTableColumn<T>[];
    getRowId: (row: T) => string | number;

    // ✅ pagination
    currentPage?: number;
    lastPage?: number;
    onPageChange?: (page: number) => void;

    // Search & Filter & Sort (optional)
    searchPlaceholder?: string;
    onSearch: (value: string) => void;
    sortOptions?: { label: string; value: string }[];
    onSortChange?: (sort: string) => void;
    filterOptions?: { label: string; value: string }[];
    onFilterChange?: (filter: string | undefined) => void;
    createHref?: string;
};


export function DataSelectionModal<T>({
    open,
    onClose,
    title,
    scope,
    mode = "multiple",
    isLoading,
    emptyText,
    data,
    columns,
    getRowId,
    onConfirm,
    currentPage,
    lastPage,
    onPageChange,
    searchPlaceholder,
    onSearch,
    sortOptions,
    onSortChange,
    filterOptions,
    onFilterChange,
    createHref,
}: DataSelectionModalProps<T>) {
    const dispatch = useDispatch();

    const selectedItems = useSelector((state: any) =>
        selectSelectedItems(state, scope)
    ) as { id: string; payload: T }[];

    // init scope on open
    useEffect(() => {
        if (open) {
            dispatch(initScope({ scope, mode }));
        }

        return () => {
            dispatch(clearScope({ scope }));
        };
    }, [open]);


    const selectedRows = selectedItems.map(x => x.payload);

    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                onclick: onClose();
            }}
        >
            <DialogContent
                className="max-w-5xl p-0"
                onPointerDownOutside={e => e.preventDefault()}
                onEscapeKeyDown={e => e.preventDefault()}
            >
                {/* Header */}
                <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b">
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {/* Body */}
                <div className="p-6">
                    {/* Table Toolbar */}
                    <TableToolbar
                        searchPlaceholder={searchPlaceholder}
                        onSearch={onSearch}
                        sortOptions={sortOptions}
                        onSortChange={values => onSortChange && onSortChange(values[0])}
                        filterOptions={filterOptions}
                        onFilterChange={val => onFilterChange && onFilterChange(val || undefined)}
                        createHref={createHref}
                    />

                    {/* Data Table */}
                    <DataTable<T>
                        columns={columns}
                        data={data}
                        isLoading={isLoading}
                        emptyText={emptyText}
                        rowSelection={{
                            mode,
                            selected: selectedRows,
                            getRowId,
                            onChange: rows => {
                                dispatch(
                                    setSelection({
                                        scope,
                                        items: rows.map(row => ({
                                            id: String(getRowId(row)),
                                            payload: row,
                                        })),
                                    })
                                );
                            },
                        }}
                    />

                    {/* Pagination */}
                    {currentPage && lastPage && onPageChange && (
                        <div className="flex justify-center border-t px-6 py-4">
                            <GlobalPagination
                                currentPage={currentPage}
                                lastPage={lastPage}
                                onPageChange={onPageChange}
                            />
                        </div>
                    )}
                </div>


                {/* Footer */}
                <div className="flex justify-end gap-2 border-t px-6 py-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button
                        onClick={() => {
                            onConfirm(selectedRows);
                            onClose();
                        }}
                        disabled={!selectedRows.length}
                    >
                        Confirm ({selectedRows.length})
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
