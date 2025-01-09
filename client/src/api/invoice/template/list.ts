import { useQuery } from "@tanstack/react-query";
import {
  type APIResponse,
  endpoint,
  INVOICE_TEMPLATE_LIST_QUERY_KEY,
  Invoice,
} from "api";

export function useInvoiceTemplateListQuery() {
  return useQuery<APIResponse<Invoice[], string>>({
    queryKey: INVOICE_TEMPLATE_LIST_QUERY_KEY,
    async queryFn() {
      const response = await fetch(endpoint("invoice.template.list"));
      const data = await response.json();
      return data;
    },
  });
}
