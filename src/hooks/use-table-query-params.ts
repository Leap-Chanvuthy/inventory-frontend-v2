import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

type TableQueryConfig = {
  defaultPage?: number;
  defaultPerPage?: number;
  defaultSearch?: string;
  defaultSort?: string;
  defaultFilter?: string;
  pageParam?: string;
  perPageParam?: string;
  searchParam?: string;
  sortParam?: string;
  filterParam?: string;
};

export function useTableQueryParams(config?: TableQueryConfig) {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = config?.pageParam || "page";
  const perPageParam = config?.perPageParam || "per_page";
  const searchParam = config?.searchParam || "search";
  const sortParam = config?.sortParam || "sort";
  const filterParam = config?.filterParam || "filter";

  const [page, setPage] = useState(
    Number(searchParams.get(pageParam)) || config?.defaultPage || 1
  );

  const [perPage, setPerPage] = useState(
    Number(searchParams.get(perPageParam)) || config?.defaultPerPage || 10
  );

  const [search, setSearch] = useState(
    searchParams.get(searchParam) || config?.defaultSearch || ""
  );

  const [sort, setSort] = useState<string | undefined>(
    searchParams.get(sortParam) || config?.defaultSort
  );

  const [filter, setFilter] = useState<string | undefined>(
    searchParams.get(filterParam) || config?.defaultFilter
  );

  //  Sync state → URL (preserves 'tab' and other params)f
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);

    const tabParam = searchParams.get("tab");

    // Add This because when the user like search and then they delete the text in the box so we want to clear the url as well
    newParams.delete(searchParam);
    newParams.delete(pageParam);
    newParams.delete(perPageParam);
    newParams.delete(sortParam);
    newParams.delete(filterParam);

    // Add new table params (only if not default values)
    if (search) newParams.set(searchParam, search);
    if (page > 1) newParams.set(pageParam, String(page));
    if (perPage && perPage !== (config?.defaultPerPage || 10))
      newParams.set(perPageParam, String(perPage));
    if (sort) newParams.set(sortParam, sort);
    if (filter) newParams.set(filterParam, filter);

    //  Restore 'tab' parameter if it existed
    if (tabParam) newParams.set("tab", tabParam);

    setSearchParams(newParams, { replace: true });
  }, [
    search,
    page,
    perPage,
    sort,
    filter,
    searchParams,
    setSearchParams,
    searchParam,
    pageParam,
    perPageParam,
    sortParam,
    filterParam,
    config?.defaultPerPage,
  ]);

  // API params (memoized)
  const apiParams = useMemo(
    () => ({
      page,
      "filter[search]": search || undefined,
      sort,
      filter,
      per_page: perPage,
    }),
    [page, search, perPage, sort, filter]
  );

  return {
    // state
    page,
    search,
    sort,
    filter,
    perPage,

    // setters
    setPage,
    setSearch,
    setSort,
    setFilter,
    setPerPage,

    // api-ready params
    apiParams,
  };
}