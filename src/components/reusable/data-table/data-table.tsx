import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumn, RowSelection } from "./data-table.type";
import DataTableLoading from "./data-table-loading";
import DataTableEmpty from "./data-table-empty";

type DataTableProps<T> = {
    columns: DataTableColumn<T>[];
    data?: T[];
    isLoading?: boolean;
    emptyText?: string;

    /** Optional row selection */
    rowSelection?: RowSelection<T>;
};


export function DataTable<T>({
    columns,
    data,
    isLoading = false,
    emptyText = "No data found",
    rowSelection,
}: DataTableProps<T>) {
    const hasSelection = !!rowSelection;
    const isMultiple = rowSelection?.mode === "multiple";

    const allSelected =
        hasSelection &&
        isMultiple &&
        data?.length &&
        data.every((row) =>
            rowSelection.selected.some(
                (r) =>
                    rowSelection.getRowId(r) === rowSelection.getRowId(row)
            )
        );

    function isSelected<T>(
        row: T,
        selected: T[],
        getRowId: (row: T) => string | number
    ) {
        return selected.some((r) => getRowId(r) === getRowId(row));
    }


    const toggleRow = (row: T) => {
        if (!rowSelection) return;

        const { selected, onChange, mode, getRowId } = rowSelection;
        const exists = isSelected(row, selected, getRowId);

        if (mode === "single") {
            onChange(exists ? [] : [row]);
        } else {
            onChange(
                exists
                    ? selected.filter(
                        (r) => getRowId(r) !== getRowId(row)
                    )
                    : [...selected, row]
            );
        }
    };

    const toggleAll = () => {
        if (!rowSelection || !data || rowSelection.mode !== "multiple") return;

        rowSelection.onChange(allSelected ? [] : data);
    };

    return (
        <div className="grid grid-cols-1 justify-items-center rounded-lg border border-border overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        {hasSelection && (
                            <TableHead className="w-[40px] whitespace-nowrap">
                                {isMultiple && (
                                    <Checkbox
                                        checked={!!allSelected}
                                        onCheckedChange={toggleAll}
                                    />
                                )}
                            </TableHead>
                        )}

                        {columns.map((col) => (
                            <TableHead key={col.key} className={`${col.className} whitespace-nowrap`}>
                                {col.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length + (hasSelection ? 1 : 0)}
                                className="p-0"
                            >
                                <div className="flex min-h-[220px] w-full items-center justify-center text-center">
                                    <DataTableLoading />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : data?.length ? (
                        data.map((row, idx) => {
                            const selected =
                                rowSelection &&
                                isSelected(
                                    row,
                                    rowSelection.selected,
                                    rowSelection.getRowId
                                );

                            return (
                                <TableRow
                                    key={idx}
                                    data-state={selected ? "selected" : undefined}
                                >
                                    {hasSelection && (
                                        <TableCell>
                                            <Checkbox
                                                checked={!!selected}
                                                onCheckedChange={() => toggleRow(row)}
                                            />
                                        </TableCell>
                                    )}

                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            className={col.className}
                                        >
                                            {col.render
                                                ? col.render(row)
                                                : (row as any)[col.key]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length + (hasSelection ? 1 : 0)}
                                className="text-center py-6"
                            >
                                <DataTableEmpty emptyText={emptyText} />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
