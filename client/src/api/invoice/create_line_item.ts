import { useMutation } from "@tanstack/react-query";
import {
  INVOICE_QUERY_KEY,
  type CreateLineItem,
  endpoint,
  queryClient,
} from "api";
import { Uuid } from "common";

export type CreateLineItemParams = {
  invoiceId: number;
  lineItem: CreateLineItem;
};

export type CreatedLineItem = {
  invoiceId: number;
  lineItemKey: Uuid;
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
    onSuccess({ invoiceId }) {
      queryClient.invalidateQueries({
        queryKey: [...INVOICE_QUERY_KEY, invoiceId],
      });
    },
  });
}
