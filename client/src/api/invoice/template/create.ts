import { useMutation } from "@tanstack/react-query";
import { endpoint, INVOICE_TEMPLATE_QUERY_KEY, queryClient } from "api";

export type CreateInvoiceTemplate = {
  invoiceId: number;
};

export function useInvoiceTemplateCreateMutation() {
  return useMutation({
    mutationFn(invoiceTemplate: CreateInvoiceTemplate) {
      return fetch(endpoint("invoice.template.create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceTemplate),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: INVOICE_TEMPLATE_QUERY_KEY,
      });
    },
  });
}
