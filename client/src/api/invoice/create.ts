import { useMutation } from "@tanstack/react-query";
import { INVOICE_LIST_QUERY_KEY, endpoint, queryClient } from "api";

export type CreateInvoice = { business_id: number };
export type CreatedInvoice = { invoice_id: number };

export function useInvoiceCreateMutation() {
  return useMutation({
    async mutationFn(invoice: CreateInvoice) {
      const res = await fetch(endpoint("invoice.create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });
      const data = await res.json();
      return data.data as CreatedInvoice;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: INVOICE_LIST_QUERY_KEY });
    },
  });
}
