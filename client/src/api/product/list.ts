import { useQuery } from "@tanstack/react-query";
import { PRODUCT_LIST_QUERY_KEY, endpoint, isAPIResponse } from "api";
import { invariant } from "common";

export type ProductListParams = {
  businessId: number;
};

export type ProductListItem = {
  productId: number;
  name: string;
};

export function useProductListQuery(params: ProductListParams, enabled: boolean = true) {
  return useQuery<ProductListItem[]>({
    queryKey: PRODUCT_LIST_QUERY_KEY,
    enabled,
    async queryFn() {
      const response = await fetch(endpoint("product.list"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      invariant(isAPIResponse<ProductListItem[]>(data), "API response is not in the correct shape");
      if (data.error !== null) throw new Error(JSON.stringify(data.error));
      return data.data;
    },
  });
}
