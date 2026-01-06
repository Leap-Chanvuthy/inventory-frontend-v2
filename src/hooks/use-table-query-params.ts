// import { useEffect, useMemo, useState } from "react";
// import { useSearchParams } from "react-router-dom";

// type TableQueryConfig = {
//   defaultPage?: number;
//   defaultPerPage?: number;
//   defaultSearch?: string;
//   defaultSort?: string;
//   defaultFilter?: string;
// };

// export function useTableQueryParams(config?: TableQueryConfig) {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const [page, setPage] = useState(
//     Number(searchParams.get("page")) || config?.defaultPage || 1
//   );

//   const [perPage, setPerPage] = useState(
//     Number(searchParams.get("per_page")) || config?.defaultPerPage || 10
//   );

//   const [search, setSearch] = useState(
//     searchParams.get("search") || config?.defaultSearch || ""
//   );

//   const [sort, setSort] = useState<string | undefined>(
//     searchParams.get("sort") || config?.defaultSort
//   );

//   const [filter, setFilter] = useState<string | undefined>(
//     searchParams.get("filter") || config?.defaultFilter
//   );

//   // 🔁 Sync state → URL
//   useEffect(() => {
//     const params: Record<string, string> = {};

//     if (search) params.search = search;
//     if (page > 1) params.page = String(page);
//     if (perPage && perPage !== (config?.defaultPerPage || 10))
//       params.per_page = String(perPage);
//     if (sort) params.sort = sort;
//     if (filter) params.filter = filter;

//     setSearchParams(params, { replace: true });
//   }, [search, page, perPage, sort, filter, setSearchParams]);

//   // 📦 API params (memoized)
//   const apiParams = useMemo(
//     () => ({
//       page,
//       "filter[search]": search || undefined,
//       sort,
//       filter,
//       per_page: perPage,
//     }),
//     [page, search, perPage, sort, filter]
//   );

//   return {
//     // state
//     page,
//     search,
//     sort,
//     filter,
//     perPage,

//     // setters
//     setPage,
//     setSearch,
//     setSort,
//     setFilter,
//     setPerPage,

//     // api-ready params
//     apiParams,
//   };
// }

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

type TableQueryConfig = {
  defaultPage?: number;
  defaultPerPage?: number;
  defaultSearch?: string;
  defaultSort?: string;
  defaultFilter?: string;
};

export function useTableQueryParams(config?: TableQueryConfig) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(
    Number(searchParams.get("page")) || config?.defaultPage || 1
  );

  const [perPage, setPerPage] = useState(
    Number(searchParams.get("per_page")) || config?.defaultPerPage || 10
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

  //  Sync state → URL (preserves 'tab' and other params)f
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);

    const tabParam = searchParams.get("tab");

    // Add This because when the user like search and then they delete the text in the box so we want to clear the url as well
    newParams.delete("search");
    newParams.delete("page");
    newParams.delete("per_page");
    newParams.delete("sort");
    newParams.delete("filter");

    // Add new table params (only if not default values)
    if (search) newParams.set("search", search);
    if (page > 1) newParams.set("page", String(page));
    if (perPage && perPage !== (config?.defaultPerPage || 10))
      newParams.set("per_page", String(perPage));
    if (sort) newParams.set("sort", sort);
    if (filter) newParams.set("filter", filter);

    //  Restore 'tab' parameter if it existed
    if (tabParam) newParams.set("tab", tabParam);

    setSearchParams(newParams, { replace: true });
  }, [search, page, perPage, sort, filter, searchParams, setSearchParams]);

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
