export type SelectionMode = "single" | "multiple";

export type ApiSearchSelectProps<T> = {
  mode?: SelectionMode;

  data?: T[];
  isLoading?: boolean;
  emptyText?: string;

  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  selected: T[];
  onChange: (items: T[]) => void;

  getId: (item: T) => string | number;

  /** Multi-line label support */
  getLabels: (item: T) => Array<string | number>;

  /** ✅ Pagination (optional) */
  currentPage?: number;
  lastPage?: number;
  onPageChange?: (page: number) => void;
};