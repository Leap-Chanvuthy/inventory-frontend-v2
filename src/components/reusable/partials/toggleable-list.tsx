import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import { DataTable } from "@/components/reusable/data-table/data-table";
import { DataCard } from "@/components/reusable/data-card/data-card-list";
import { DataTableColumn, RowSelection } from "../data-table/data-table.type";

// NOTE: update this import path to your actual slice file location
import {
  initScope,
  setMode,
  setSelection,
} from "@/redux/slices/selection-slice";

type ListOption = "table" | "card";
type SelectionMode = "single" | "multiple";

type ToggleableSelection<T> = {
  /** A unique key per list: "users", "products", etc. */
  scope: string;
  mode?: SelectionMode;
  /** Must be stable and unique per row */
  getRowId: (row: T) => string | number;
};

export interface ToggleableListProps<T> {
  items?: T[];
  isLoading: boolean;

  /** Text shown when items is empty */
  emptyText?: string;

  /** Table view */
  columns: DataTableColumn<T>[];

  /** Card view */
  renderItem: (item: T) => React.ReactNode;

  /** Optional table selection (if omitted => no selection column at all) */
  selection?: ToggleableSelection<T>;

  /**
   * Optional override. If not provided, it will use Redux: state.listOptions.option
   */
  option?: ListOption;
}

export function ToggleableList<T>({
  items,
  isLoading,
  emptyText = "No data found",
  columns,
  renderItem,
  selection,
  option: optionOverride,
}: ToggleableListProps<T>) {
  const dispatch = useDispatch();

  const { option: optionFromStore } = useSelector(
    (state: RootState) => state.listOptions
  );

  // Selection scope state from Redux (optional)
  const scopeState = useSelector((state: RootState) =>
    selection ? state.selection.scopes[selection.scope] : undefined
  );

  // Ensure scope exists (and apply mode if provided) without resetting existing selection
  React.useEffect(() => {
    if (!selection) return;

    const exists = !!scopeState;
    if (!exists) {
      dispatch(initScope({ scope: selection.scope, mode: selection.mode }));
      return;
    }

    if (selection.mode && scopeState?.mode !== selection.mode) {
      dispatch(setMode({ scope: selection.scope, mode: selection.mode }));
    }
  }, [
    dispatch,
    selection,
    selection?.scope,
    selection?.mode,
    scopeState,
    scopeState?.mode,
  ]);

  const option = optionOverride ?? (optionFromStore as ListOption);

  const selectedRows = React.useMemo(() => {
    if (!selection || !items?.length || !scopeState?.ids?.length) return [];

    const idSet = new Set(scopeState.ids);
    return items.filter((row) => idSet.has(String(selection.getRowId(row))));
  }, [items, scopeState?.ids, selection]);

  const rowSelection: RowSelection<T> | undefined = React.useMemo(() => {
    if (!selection) return undefined;

    const mode = (scopeState?.mode ?? selection.mode ?? "multiple") as SelectionMode;

    return {
      mode,
      selected: selectedRows,
      getRowId: selection.getRowId,
      onChange: (rows) => {
        dispatch(
          setSelection({
            scope: selection.scope,
            items: rows.map((r) => ({
              id: String(selection.getRowId(r)),
              payload: r,
            })),
          })
        );
      },
    };
  }, [dispatch, scopeState?.mode, selection, selectedRows]);

  return (
    <section>
      {option === "table" && (
        <DataTable<T>
          columns={columns}
          data={items}
          isLoading={isLoading}
          emptyText={emptyText}
          rowSelection={rowSelection}
        />
      )}

      {option === "card" && (
        <DataCard<T>
          data={items}
          isLoading={isLoading}
          emptyText={emptyText}
          renderItem={renderItem}
        />
      )}
    </section>
  );
}