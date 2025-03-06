import { useMutation } from "@tanstack/react-query";
import {
  INVOICE_QUERY_KEY,
  type KeyedMutableLineItem,
  endpoint,
  queryClient,
} from "api";
import type { Uuid } from "common";

export type MutateLineItem = {
  invoice_id: number;
  mutation: KeyedMutableLineItem;
};

export type MutatedLineItem = {
  invoice_id: number;
  line_item_key: Uuid;
};

export function useLineItemMutation() {
  return useMutation<MutatedLineItem, Error, MutateLineItem>({
    async mutationFn(lineItem) {
      const res = await fetch(endpoint("invoice.draft.line_item.mutate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lineItem),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data.data;
    },
    onSuccess({ invoice_id }) {
      queryClient.invalidateQueries({
        queryKey: [...INVOICE_QUERY_KEY, invoice_id],
      });
    },
  });
}
