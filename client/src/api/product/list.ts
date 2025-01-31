import { useQuery } from "@tanstack/react-query";
import {
  type APIResponse,
  endpoint,
  isAPIResponse,
  PRODUCT_LIST_QUERY_KEY,
} from "api";
import { invariant } from "common";

export type ProductListParams = {
  business_id: number;
};

export type ProductListItem = {
  product_id: number;
  name: string;
};

export function useProductListQuery(
  params: ProductListParams,
  enabled: boolean = true,
) {
  return useQuery<APIResponse<ProductListItem[]>>({
    queryKey: PRODUCT_LIST_QUERY_KEY,
    enabled,
    async queryFn() {
      const response = await fetch(endpoint("product.list"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await response.json();

      invariant(
        isAPIResponse<ProductListItem[]>(data),
        "API response is not in the correct shape",
      );

      if (data.error) {
        throw new Error(JSON.stringify(data.error));
      }

      return data;
    },
  });
}
