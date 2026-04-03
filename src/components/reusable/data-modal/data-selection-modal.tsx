import { useEffect, useRef } from "react";
import type { FetchParams, FetchResult } from "@/components/reusable/partials/searchable-select";
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
import { useLocation } from "react-router-dom";

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
    getRowLabel?: (row: T) => string;
    defaultSelected?: T[];

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
    filterFetchFn?: (params: FetchParams) => Promise<FetchResult>;
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
    filterFetchFn,
    createHref,
    defaultSelected,
    getRowLabel,
}: DataSelectionModalProps<T>) {
    const path = useLocation().pathname;
    const dispatch = useDispatch();

    const selectedItems = useSelector((state: any) =>
        selectSelectedItems(state, scope)
    ) as { id: string; payload: T }[];

    // Init scope and pre-populate selection when modal opens; clear on close/unmount
    useEffect(() => {
        if (open) {
            dispatch(initScope({ scope, mode }));
            if (defaultSelected?.length) {
                dispatch(setSelection({
                    scope,
                    items: defaultSelected.map(row => ({
                        id: String(getRowId(row)),
                        payload: row,
                    })),
                }));
            }
        } else {
            dispatch(clearScope({ scope }));
        }
    }, [open, path]);


    const selectedRows = selectedItems.map(x => x.payload);

    // Track previous sort selection to detect which value was newly checked
    const prevSortRef = useRef<string[]>([]);

    const handleSortChange = (values: string[]) => {
        if (values.length === 0) {
            prevSortRef.current = [];
            onSortChange?.("");
            return;
        }
        const newVal = values.find(v => !prevSortRef.current.includes(v));
        prevSortRef.current = values;
        if (newVal) onSortChange?.(newVal);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onClose}
        >
            <DialogContent
                className="max-w-7xl mx-w-[95vw] max-h-[90vh] overflow-y-auto"
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
                        onSortChange={handleSortChange}
                        filterOptions={filterOptions}
                        onFilterChange={val => onFilterChange && onFilterChange(val || undefined)}
                        filterFetchFn={filterFetchFn}
                        createHref={createHref}
                    />

                    {/* Data Table */}
                    <DataTable<T>
                        columns={columns}
                        data={data}
                        isLoading={isLoading}
                        loadingClassName="min-h-[320px]"
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


                {/* Selected summary */}
                {selectedRows.length > 0 && (
                    <div className="px-6 py-3 border-t bg-muted/30">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">
                            Selected ({selectedRows.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {selectedRows.map(row => (
                                <span
                                    key={String(getRowId(row))}
                                    className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1"
                                >
                                    {getRowLabel ? getRowLabel(row) : String(getRowId(row))}
                                    <button
                                        type="button"
                                        className="hover:text-destructive"
                                        onClick={() => {
                                            const updated = selectedRows.filter(r => getRowId(r) !== getRowId(row));
                                            dispatch(setSelection({
                                                scope,
                                                items: updated.map(r => ({ id: String(getRowId(r)), payload: r })),
                                            }));
                                        }}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

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
