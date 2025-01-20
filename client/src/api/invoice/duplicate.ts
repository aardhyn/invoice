import { useMutation } from "@tanstack/react-query";
import { INVOICE_LIST_QUERY_KEY, endpoint, queryClient } from "api";

export type DuplicateInvoice = {
  invoice_id: number;
};

export function useInvoiceDuplicateMutation() {
  return useMutation({
    mutationFn(invoice: DuplicateInvoice) {
      return fetch(endpoint("invoice.duplicate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: INVOICE_LIST_QUERY_KEY });
    },
  });
}
