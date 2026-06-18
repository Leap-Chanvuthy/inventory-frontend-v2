import { useCallback, useMemo } from "react";
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

type QueryParamValue = string | number | undefined | null;

type ClearQueryParamsOptions = {
  includeSearch?: boolean;
  includeSort?: boolean;
  includeFilter?: boolean;
  includePerPage?: boolean;
  extraParams?: string[];
};

export function useTableQueryParams(config?: TableQueryConfig) {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = config?.pageParam || "page";
  const perPageParam = config?.perPageParam || "per_page";
  const searchParam = config?.searchParam || "search";
  const sortParam = config?.sortParam || "sort";
  const filterParam = config?.filterParam || "filter";

  const defaultPage = config?.defaultPage || 1;
  const defaultPerPage = config?.defaultPerPage || 10;
  const defaultSearch = config?.defaultSearch || "";
  const defaultSort = config?.defaultSort;
  const defaultFilter = config?.defaultFilter;

  const page = Number(searchParams.get(pageParam)) || defaultPage;
  const perPage = Number(searchParams.get(perPageParam)) || defaultPerPage;
  const search = searchParams.get(searchParam) || defaultSearch;
  const sort = searchParams.get(sortParam) || defaultSort;
  const filter = searchParams.get(filterParam) || defaultFilter;

  const updateParams = useCallback(
    (
      updates: Record<string, QueryParamValue>,
      options?: { resetPage?: boolean },
    ) => {
      setSearchParams(
        currentParams => {
          const next = new URLSearchParams(currentParams);

          Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") {
              next.delete(key);
              return;
            }

            next.set(key, String(value));
          });

          if (options?.resetPage) {
            next.delete(pageParam);
          }

          return next.toString() === currentParams.toString()
            ? currentParams
            : next;
        },
        { replace: true },
      );
    },
    [pageParam, setSearchParams],
  );

  const setPage = useCallback(
    (value: number) => {
      updateParams({
        [pageParam]: value > 1 ? value : undefined,
      });
    },
    [pageParam, updateParams],
  );

  const setPerPage = useCallback(
    (value: number) => {
      updateParams(
        {
          [perPageParam]: value !== defaultPerPage ? value : undefined,
        },
        { resetPage: true },
      );
    },
    [defaultPerPage, perPageParam, updateParams],
  );

  const setSearch = useCallback(
    (value?: string) => {
      const nextValue = value || "";

      updateParams(
        {
          [searchParam]:
            nextValue !== defaultSearch ? nextValue : undefined,
        },
        { resetPage: true },
      );
    },
    [defaultSearch, searchParam, updateParams],
  );

  const setSort = useCallback(
    (value?: string) => {
      updateParams(
        {
          [sortParam]:
            value && value !== defaultSort ? value : undefined,
        },
        { resetPage: true },
      );
    },
    [defaultSort, sortParam, updateParams],
  );

  const setFilter = useCallback(
    (value?: string) => {
      updateParams(
        {
          [filterParam]:
            value && value !== defaultFilter ? value : undefined,
        },
        { resetPage: true },
      );
    },
    [defaultFilter, filterParam, updateParams],
  );

  const clearQueryParams = useCallback(
    (options?: ClearQueryParamsOptions) => {
      const {
        includeSearch = true,
        includeSort = true,
        includeFilter = true,
        includePerPage = true,
        extraParams = [],
      } = options || {};

      setSearchParams(
        currentParams => {
          const next = new URLSearchParams(currentParams);

          next.delete(pageParam);

          if (includeSearch) next.delete(searchParam);
          if (includeSort) next.delete(sortParam);
          if (includeFilter) next.delete(filterParam);
          if (includePerPage) next.delete(perPageParam);

          extraParams.forEach(param => {
            next.delete(param);
          });

          return next.toString() === currentParams.toString()
            ? currentParams
            : next;
        },
        { replace: true },
      );
    },
    [
      filterParam,
      pageParam,
      perPageParam,
      searchParam,
      setSearchParams,
      sortParam,
    ],
  );

  const apiParams = useMemo(
    () => ({
      page,
      "filter[search]": search || undefined,
      sort,
      filter,
      per_page: perPage,
    }),
    [page, perPage, search, sort, filter],
  );

  return {
    page,
    search,
    sort,
    filter,
    perPage,
    setPage,
    setSearch,
    setSort,
    setFilter,
    setPerPage,
    clearQueryParams,
    apiParams,
  };
}
