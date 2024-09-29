import { useQuery } from "@tanstack/react-query";
import { APIResponse, endpoint, isAPIResponse } from "api";
import { invariant } from "common";

export type ProductListItem = {
  product_id: number;
  name: string;
};

export function useProductListQuery() {
  return useQuery<APIResponse<ProductListItem[]>>({
    queryKey: ["product"],
    async queryFn() {
      const response = await fetch(endpoint("product.list"));
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
