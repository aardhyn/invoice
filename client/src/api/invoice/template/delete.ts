import { useMutation } from "@tanstack/react-query";
import { endpoint, INVOICE_TEMPLATE_QUERY_KEY, queryClient } from "api";

export type DeleteInvoiceTemplate = {
  invoice_id: number;
};

export function useInvoiceTemplateDeleteMutation() {
  return useMutation({
    mutationFn(invoiceTemplate: DeleteInvoiceTemplate) {
      return fetch(endpoint("invoice.template.delete"), {
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
