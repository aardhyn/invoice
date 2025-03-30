import { useMutation } from "@tanstack/react-query";
import { INVOICE_QUERY_KEY, endpoint, queryClient } from "api";
import { Uuid } from "common";

export type DeleteLineItem = {
  invoiceId: number;
  lineItemKey: Uuid;
};

export type DeletedLineItem = {
  invoiceId: number;
  lineItemKey: Uuid;
};

export function useLineItemDeleteMutation() {
  return useMutation<DeletedLineItem, Error, DeleteLineItem>({
    async mutationFn(lineItem: DeleteLineItem) {
      const res = await fetch(endpoint("invoice.draft.line_item.delete"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
