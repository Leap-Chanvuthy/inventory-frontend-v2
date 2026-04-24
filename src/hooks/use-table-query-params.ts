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
  const searchParamsString = searchParams.toString();

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

  // Sync URL -> state (supports back/forward navigation)
  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const nextPage = Number(params.get(pageParam)) || config?.defaultPage || 1;
    const nextPerPage =
      Number(params.get(perPageParam)) || config?.defaultPerPage || 10;
    const nextSearch = params.get(searchParam) || config?.defaultSearch || "";
    const nextSort = params.get(sortParam) || config?.defaultSort;
    const nextFilter = params.get(filterParam) || config?.defaultFilter;

    setPage(prev => (prev === nextPage ? prev : nextPage));
    setPerPage(prev => (prev === nextPerPage ? prev : nextPerPage));
    setSearch(prev => (prev === nextSearch ? prev : nextSearch));
    setSort(prev => (prev === nextSort ? prev : nextSort));
    setFilter(prev => (prev === nextFilter ? prev : nextFilter));
  }, [
    searchParamsString,
    pageParam,
    perPageParam,
    searchParam,
    sortParam,
    filterParam,
    config?.defaultPage,
    config?.defaultPerPage,
    config?.defaultSearch,
    config?.defaultSort,
    config?.defaultFilter,
  ]);

  // Sync state -> URL while preserving unrelated params
  useEffect(() => {
    const newParams = new URLSearchParams(searchParamsString);

    newParams.delete(searchParam);
    newParams.delete(pageParam);
    newParams.delete(perPageParam);
    newParams.delete(sortParam);
    newParams.delete(filterParam);

    if (search) newParams.set(searchParam, search);
    if (page > 1) newParams.set(pageParam, String(page));
    if (perPage && perPage !== (config?.defaultPerPage || 10))
      newParams.set(perPageParam, String(perPage));
    if (sort) newParams.set(sortParam, sort);
    if (filter) newParams.set(filterParam, filter);

    const nextParamsString = newParams.toString();
    if (nextParamsString !== searchParamsString) {
      setSearchParams(newParams, { replace: true });
    }
  }, [
    search,
    page,
    perPage,
    sort,
    filter,
    setSearchParams,
    searchParam,
    pageParam,
    perPageParam,
    sortParam,
    filterParam,
    searchParamsString,
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
