import { useMutation } from "@tanstack/react-query";
import { INVOICE_QUERY_KEY, endpoint, queryClient } from "api";
import { Uuid } from "common";

export type DeleteLineItem = {
  invoice_id: number;
  line_item_key: Uuid;
};

export type DeletedLineItem = {
  invoice_id: number;
  line_item_key: Uuid;
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
