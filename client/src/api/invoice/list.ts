import { useQuery } from "@tanstack/react-query";
import { type APIResponse, endpoint, INVOICE_LIST_QUERY_KEY } from "api";

export type InvoiceListItem = {
  invoice_id: number;
  name: string;
  description: string;
  due_date: string;
};

export function useInvoiceListQuery() {
  return useQuery<APIResponse<InvoiceListItem[], string>>({
    queryKey: INVOICE_LIST_QUERY_KEY,
    async queryFn() {
      const response = await fetch(endpoint("invoice.list"));
      const data = await response.json();
      return data;
    },
  });
}
