import { useMutation } from "@tanstack/react-query";
import { invariant } from "common";
import { INVOICE_LIST_QUERY_KEY, endpoint, isAPIResponse, queryClient } from "api";

export type DuplicateInvoice = {
  invoiceId: number;
};

export type DuplicatedInvoice = {
  invoiceId: number;
  name: string;
};

export function useInvoiceDuplicateMutation() {
  return useMutation({
    async mutationFn(invoice: DuplicateInvoice) {
      const res = await fetch(endpoint("invoice.duplicate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });
      const data = await res.json();
      invariant(isAPIResponse<DuplicatedInvoice>(data), "Malformed API Response");
      if (data.error !== null) throw { error: data.error };
      return data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: INVOICE_LIST_QUERY_KEY });
    },
  });
}
