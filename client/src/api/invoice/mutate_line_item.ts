import { useMutation } from "@tanstack/react-query";
import { INVOICE_QUERY_KEY, type KeyedMutableLineItem, endpoint, queryClient } from "api";
import type { Uuid } from "common";

export type MutateLineItem = {
  invoiceId: number;
  mutation: KeyedMutableLineItem;
};

export type MutatedLineItem = {
  invoiceId: number;
  lineItemKey: Uuid;
};

export function useLineItemMutation() {
  return useMutation<MutatedLineItem, Error, MutateLineItem>({
    async mutationFn(lineItem) {
      const res = await fetch(endpoint("invoice.draft.line_item.mutate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(lineItem),
      });
      const data = await res.json();
      if (data.error !== null) throw { error: data.error };
      return data.data;
    },
    onSuccess({ invoiceId }) {
      queryClient.invalidateQueries({
        queryKey: [...INVOICE_QUERY_KEY, invoiceId],
      });
    },
  });
}
