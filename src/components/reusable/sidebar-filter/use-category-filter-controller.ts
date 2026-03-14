import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { CategoryDialogValues } from "./category-create-update-dialog";

type CategoryStatus = "active" | "deleted";

interface CategoriesEnvelope<TCategory> {
  data?: {
    data?: TCategory[];
    last_page?: number;
    total?: number;
  };
}

interface CategoriesQueryResult<TCategory> {
  data?: CategoriesEnvelope<TCategory>;
  isLoading: boolean;
}

interface CreateMutation<TValues> {
  mutateAsync: (values: TValues) => Promise<unknown>;
  isPending: boolean;
}

interface UpdateMutation<TUpdatePayload> {
  mutateAsync: (values: TUpdatePayload) => Promise<unknown>;
  isPending: boolean;
}

interface DeleteMutation {
  mutate: (id: number, options?: { onSuccess?: () => void }) => void;
}

interface RestoreMutation {
  mutate: (id: number) => void;
}

interface UseCategoryFilterControllerOptions<
  TCategory,
  TQueryParams,
  TCreatePayload = CategoryDialogValues,
  TUpdatePayload = { id: number; payload: CategoryDialogValues },
> {
  queryPrefix?: string;
  selectedCategoryParam?: string;
  perPage?: number;
  sort?: string;
  defaultStatus?: CategoryStatus;
  mapQueryParams: (args: {
    page: number;
    perPage: number;
    search: string;
    status: CategoryStatus;
    sort: string;
  }) => TQueryParams;
  useCategoriesQuery: (params: TQueryParams) => CategoriesQueryResult<TCategory>;
  useCreateMutation: () => CreateMutation<TCreatePayload>;
  useUpdateMutation: () => UpdateMutation<TUpdatePayload>;
  useDeleteMutation: () => DeleteMutation;
  useRestoreMutation?: () => RestoreMutation;
  mapCreatePayload?: (values: CategoryDialogValues) => TCreatePayload;
  mapUpdatePayload?: (id: number, values: CategoryDialogValues) => TUpdatePayload;
}

export function useCategoryFilterController<
  TCategory,
  TQueryParams,
  TCreatePayload = CategoryDialogValues,
  TUpdatePayload = { id: number; payload: CategoryDialogValues },
>({
  queryPrefix = "category",
  selectedCategoryParam = "category_id",
  perPage = 10,
  sort = "category_name",
  defaultStatus = "active",
  mapQueryParams,
  useCategoriesQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useRestoreMutation,
  mapCreatePayload = values => values as TCreatePayload,
  mapUpdatePayload = (id, values) =>
    ({ id, payload: values }) as unknown as TUpdatePayload,
}: UseCategoryFilterControllerOptions<
  TCategory,
  TQueryParams,
  TCreatePayload,
  TUpdatePayload
>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    page: categoryPage,
    search: categorySearch,
    filter: categoryStatusFilter,
    setPage: setCategoryPage,
    setSearch: setCategorySearch,
    setFilter: setCategoryStatusFilter,
  } = useTableQueryParams({
    defaultPage: 1,
    defaultPerPage: perPage,
    defaultSearch: "",
    defaultFilter: defaultStatus,
    pageParam: `${queryPrefix}_page`,
    perPageParam: `${queryPrefix}_per_page`,
    searchParam: `${queryPrefix}_search`,
    filterParam: `${queryPrefix}_status`,
  });

  const selectedCategory = searchParams.get(selectedCategoryParam)
    ? Number(searchParams.get(selectedCategoryParam))
    : null;

  const categoryStatus: CategoryStatus =
    categoryStatusFilter === "deleted" ? "deleted" : "active";

  const categoryQueryParams = useMemo(
    () =>
      mapQueryParams({
        page: categoryPage,
        perPage,
        search: categorySearch,
        status: categoryStatus,
        sort,
      }),
    [categoryPage, perPage, categorySearch, categoryStatus, sort, mapQueryParams]
  );

  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategoriesQuery(categoryQueryParams);

  const createCategoryMutation = useCreateMutation();
  const updateCategoryMutation = useUpdateMutation();
  const deleteCategoryMutation = useDeleteMutation();
  const restoreCategoryMutation = useRestoreMutation?.();

  const clearSelectedCategory = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete(selectedCategoryParam);
    next.delete("page");
    setSearchParams(next, { replace: true });
  }, [searchParams, selectedCategoryParam, setSearchParams]);

  const setSelectedCategory = useCallback(
    (categoryId: number | null) => {
      if (categoryId === null) {
        clearSelectedCategory();
        return;
      }

      const next = new URLSearchParams(searchParams);
      next.set(selectedCategoryParam, String(categoryId));
      next.delete("page");
      setSearchParams(next, { replace: true });
    },
    [clearSelectedCategory, searchParams, selectedCategoryParam, setSearchParams]
  );

  const onCategorySearchChange = useCallback(
    (value: string) => {
      setCategorySearch(value);
      setCategoryPage(1);
    },
    [setCategorySearch, setCategoryPage]
  );

  const onCategoryStatusToggle = useCallback(() => {
    setCategoryStatusFilter(categoryStatus === "active" ? "deleted" : "active");
    setCategoryPage(1);
  }, [categoryStatus, setCategoryStatusFilter, setCategoryPage]);

  const handleCreateCategory = useCallback(
    async (values: CategoryDialogValues) => {
      await createCategoryMutation.mutateAsync(mapCreatePayload(values));
    },
    [createCategoryMutation, mapCreatePayload]
  );

  const handleUpdateCategory = useCallback(
    async (id: number, values: CategoryDialogValues) => {
      await updateCategoryMutation.mutateAsync(mapUpdatePayload(id, values));
    },
    [updateCategoryMutation, mapUpdatePayload]
  );

  const handleDeleteCategory = useCallback(
    (id: number) => {
      deleteCategoryMutation.mutate(id, {
        onSuccess: () => {
          if (selectedCategory !== id) return;
          clearSelectedCategory();
        },
      });
    },
    [deleteCategoryMutation, selectedCategory, clearSelectedCategory]
  );

  const handleRestoreCategory = useCallback(
    (id: number) => {
      restoreCategoryMutation?.mutate(id);
    },
    [restoreCategoryMutation]
  );

  const categories = categoriesData?.data?.data || [];
  const categoryLastPage = categoriesData?.data?.last_page || 1;
  const categoryTotal = categoriesData?.data?.total;

  return {
    categories,
    categoriesLoading,
    categoryPage,
    categorySearch,
    categoryStatus,
    categoryLastPage,
    categoryTotal,
    selectedCategory,
    setCategoryPage,
    setSelectedCategory,
    onCategorySearchChange,
    onCategoryStatusToggle,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleRestoreCategory,
    isCreatingCategory: createCategoryMutation.isPending,
    isUpdatingCategory: updateCategoryMutation.isPending,
  };
}
