import { ReactNode } from "react";

export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  className?: string;
  render?: (row: T) => ReactNode;
};

export type SelectionMode = "single" | "multiple";

export type RowSelection<T> = {
  mode: SelectionMode;
  selected: T[];
  onChange: (rows: T[]) => void;
  getRowId: (row: T) => string | number;
};
