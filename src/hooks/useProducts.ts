import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  mockProductsApi,
  mockProductApi,
  mockSearchProductsApi,
  mockUpdateProductApi,
  mockCreateProductApi,
} from "@/lib/mock-data";
import { PaginationParams, Product } from "@/types";

// 使用 React Query 獲取商品列表
export const useProducts = (params: PaginationParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () =>
      mockProductsApi(
        params.page,
        params.limit,
        params.sortBy,
        params.sortOrder
      ),
    staleTime: 5 * 60 * 1000, // 5分鐘內不會重新請求
    gcTime: 10 * 60 * 1000, // 10分鐘後從快取中移除
  });
};

// 使用 React Query 獲取單一商品
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => mockProductApi(id),
    enabled: !!id, // 只有當 id 存在時才執行請求
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 使用 React Query 搜尋商品
export const useSearchProducts = (
  query: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ["search-products", query, page, limit],
    queryFn: () => mockSearchProductsApi(query, page, limit),
    enabled: !!query && query.length > 0, // 只有當有搜尋關鍵字時才執行請求
    staleTime: 2 * 60 * 1000, // 搜尋結果快取時間較短
    gcTime: 5 * 60 * 1000,
  });
};

// 使用無限滾動的商品列表
export const useInfiniteProducts = (limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ["infinite-products", limit],
    queryFn: ({ pageParam = 1 }) => mockProductsApi(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNext
        ? lastPage.pagination.page + 1
        : undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 使用 Mutation 更新商品
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      mockUpdateProductApi(id, product),
    onSuccess: (updatedProduct, { id }) => {
      if (updatedProduct) {
        // 更新單一商品的快取
        queryClient.setQueryData(["product", id], updatedProduct);

        // 使相關查詢失效，觸發重新獲取
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["search-products"] });
        queryClient.invalidateQueries({ queryKey: ["infinite-products"] });
      }
    },
    onError: (error) => {
      console.error("更新商品失敗:", error);
    },
  });
};

// 使用 Mutation 創建商品
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) =>
      mockCreateProductApi(product),
    onSuccess: (newProduct) => {
      // 新增商品到快取
      queryClient.setQueryData(["product", newProduct.id], newProduct);

      // 使相關查詢失效，觸發重新獲取
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["search-products"] });
      queryClient.invalidateQueries({ queryKey: ["infinite-products"] });
    },
    onError: (error) => {
      console.error("建立商品失敗:", error);
    },
  });
};
