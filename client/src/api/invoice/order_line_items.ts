import { useMutation } from "@tanstack/react-query";
import { INVOICE_QUERY_KEY, endpoint, queryClient } from "api";
import type { Uuid } from "common";

export type OrderLineItems = {
  invoice_id: number;
  line_item_order: Uuid[];
};

export function useLineItemOrderMutation() {
  return useMutation({
    mutationFn(lineItem: OrderLineItems) {
      return fetch(endpoint("invoice.draft.line_item.order"), {
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
