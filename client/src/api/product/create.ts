import { useMutation } from "@tanstack/react-query";
import {
  endpoint,
  isAPIResponse,
  PRODUCT_LIST_QUERY_KEY,
  queryClient,
} from "api";
import { invariant } from "common";

export type CreateProduct = {
  businessId: number;
  name: string;
  description: string;
  unitCost: number;
};

export type CreatedProduct = {
  productId: number;
  name: string;
};

export function useProductCreateMutation() {
  return useMutation<CreatedProduct, Error, CreateProduct>({
    async mutationFn(product) {
      const res = await fetch(endpoint("product.create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const data = await res.json();

      invariant(
        isAPIResponse<CreatedProduct>(data),
        "API response is not in the correct shape",
      );

      if (data.error) throw new Error(JSON.stringify(data.error));

      return data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: PRODUCT_LIST_QUERY_KEY });
    },
  });
}
