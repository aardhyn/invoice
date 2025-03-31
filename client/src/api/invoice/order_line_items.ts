import { useMutation } from "@tanstack/react-query";
import { INVOICE_QUERY_KEY, endpoint, queryClient } from "api";
import type { Uuid } from "common";

export type OrderLineItems = {
  invoiceId: number;
  lineItemOrder: Uuid[];
};

export function useLineItemOrderMutation() {
  return useMutation({
    mutationFn(lineItem: OrderLineItems) {
      return fetch(endpoint("invoice.draft.line_item.order"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(lineItem),
      });
    },
    onSuccess(_, { invoiceId }) {
      queryClient.invalidateQueries({
        queryKey: [...INVOICE_QUERY_KEY, invoiceId],
      });
    },
  });
}
