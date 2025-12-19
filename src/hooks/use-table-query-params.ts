import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

type TableQueryConfig = {
  defaultPage?: number;
  defaultSearch?: string;
  defaultSort?: string;
  defaultFilter?: string;
};

export function useTableQueryParams(config?: TableQueryConfig) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(
    Number(searchParams.get("page")) || config?.defaultPage || 1
  );

  const [search, setSearch] = useState(
    searchParams.get("search") || config?.defaultSearch || ""
  );

  const [sort, setSort] = useState<string | undefined>(
    searchParams.get("sort") || config?.defaultSort
  );

  const [filter, setFilter] = useState<string | undefined>(
    searchParams.get("filter") || config?.defaultFilter
  );

  // 🔁 Sync state → URL
  useEffect(() => {
    const params: Record<string, string> = {};

    if (search) params.search = search;
    if (page > 1) params.page = String(page);
    if (sort) params.sort = sort;
    if (filter) params.filter = filter;

    setSearchParams(params, { replace: true });
  }, [search, page, sort, filter, setSearchParams]);

  // 📦 API params (memoized)
  const apiParams = useMemo(() => ({
    page,
    "filter[search]": search || undefined,
    sort,
    filter,
  }), [page, search, sort, filter]);

  return {
    // state
    page,
    search,
    sort,
    filter,

    // setters
    setPage,
    setSearch,
    setSort,
    setFilter,

    // api-ready params
    apiParams,
  };
}
