import { useMutation } from "@tanstack/react-query";
import {
  endpoint,
  isAPIResponse,
  PRODUCT_LIST_QUERY_KEY,
  queryClient,
} from "api";
import { invariant } from "common";

export type CreateProduct = {
  name: string;
  description: string;
  price: number;
};

export type CreatedProduct = {
  service_id: number;
  name: string;
};

export function useProductCreateMutation() {
  return useMutation({
    async mutationFn(product: CreateProduct) {
      const response = await fetch(endpoint("product.create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const data = await response.json();

      invariant(
        isAPIResponse<CreatedProduct>(data),
        "API response is not in the correct shape",
      );

      if (data.error) {
        throw new Error(JSON.stringify(data.error));
      }

      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: PRODUCT_LIST_QUERY_KEY });
    },
  });
}
