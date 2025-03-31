import { useMutation } from "@tanstack/react-query";
import { INVOICE_TEMPLATE_QUERY_KEY, endpoint, queryClient } from "api";

export type DeleteInvoiceTemplate = {
  invoiceId: number;
};

export function useInvoiceTemplateDeleteMutation() {
  return useMutation({
    mutationFn(invoiceTemplate: DeleteInvoiceTemplate) {
      return fetch(endpoint("invoice.template.delete"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
