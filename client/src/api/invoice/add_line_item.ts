import { useMutation } from "@tanstack/react-query";
import { endpoint, INVOICE_QUERY_KEY, queryClient } from "api";

export type AddLineItem = {
  invoice_id: number;
  description: string;
};

export function useAddLineItemMutation() {
  return useMutation({
    mutationFn(lineItem: AddLineItem) {
      return fetch(endpoint("invoice.line_item.add"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lineItem),
      });
    },
    onSuccess(_, { invoice_id }) {
      queryClient.invalidateQueries({
        queryKey: [...INVOICE_QUERY_KEY, invoice_id],
      });
    },
  });
}
