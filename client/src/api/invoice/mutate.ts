import { useMutation } from "@tanstack/react-query";
import {
  INVOICE_QUERY_KEY,
  type Location,
  type CreateClient,
  endpoint,
  queryClient,
} from "api";
import type { Timestampz } from "common";

export type MutateDraftInvoice = {
  invoice_id: number;
};

export type MutateDraftInvoiceParams = {
  name?: string;
  description?: string;
  reference?: string;
  client?: number | CreateClient;
  location?: Location;
  due_date?: Timestampz;
};

export function useDraftInvoiceMutation() {
  return useMutation({
    async mutationFn(mutation: MutateDraftInvoice & MutateDraftInvoiceParams) {
      const res = await fetch(endpoint("invoice.draft.mutate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mutation),
      });
      const data = await res.json();
      if (data.error) throw new Error(JSON.stringify(data.error));
      return data.data as MutateDraftInvoice;
    },
    onSuccess({ invoice_id }) {
      queryClient.invalidateQueries({
        queryKey: [...INVOICE_QUERY_KEY, invoice_id],
      });
    },
  });
}
