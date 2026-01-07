import { useEffect, useMemo, useState } from "react";

type TableQueryConfig = {
  defaultPage?: number;
  defaultPerPage?: number;
  defaultSearch?: string;
  defaultSort?: string;
  defaultFilter?: string;
};

export function useSearchSelectParams(config?: TableQueryConfig) {
  const [page, setPage] = useState<number>(config?.defaultPage ?? 1);
  const [perPage, setPerPage] = useState<number>(config?.defaultPerPage ?? 10);
  const [search, setSearch] = useState<string>(config?.defaultSearch ?? "");
  const [sort, setSort] = useState<string | undefined>(config?.defaultSort);
  const [filter, setFilter] = useState<string | undefined>(config?.defaultFilter);

  // ✅ reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  const apiParams = useMemo(
    () => ({
      page,
      per_page: perPage,
      "filter[search]": search || undefined, // Make sure api has filter[search] api param for data searching
      sort,
      filter,
    }),
    [page, perPage, search, sort, filter]
  );

  return {
    search,
    page,
    sort,
    filter,
    perPage,
    setPage,
    setSearch,
    setSort,
    setFilter,
    setPerPage,
    apiParams,
  };
}