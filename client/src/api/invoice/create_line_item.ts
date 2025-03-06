import { useMutation } from "@tanstack/react-query";
import {
  INVOICE_QUERY_KEY,
  type CreateLineItem,
  endpoint,
  queryClient,
} from "api";
import { Uuid } from "common";

export type CreateLineItemParams = {
  invoice_id: number;
  line_item: CreateLineItem;
};

export type CreatedLineItem = {
  invoice_id: number;
  line_item_key: Uuid;
};

export function useLineItemCreateMutation() {
  return useMutation<CreatedLineItem, Error, CreateLineItemParams>({
    async mutationFn(lineItem) {
      const res = await fetch(endpoint("invoice.draft.line_item.create"), {
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
